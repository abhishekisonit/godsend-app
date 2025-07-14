import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const getPublicRequestsSchema = z.object({
    category: z.enum(['Food', 'Medicine', 'Clothing', 'Electronics', 'Books', 'Other']).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    deliveryCity: z.string().max(100).optional(), // Limit string length
    limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(50)).optional(),
    offset: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
});

// Simple rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 100; // 100 requests per minute

    const record = requestCounts.get(ip);
    if (!record || now > record.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

// GET /api/requests/public - Public endpoint to browse requests (no auth required)
export async function GET(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({
                error: 'Too many requests. Please try again later.'
            }, { status: 429 });
        }

        console.log('🚀 [PUBLIC API] Starting request fetch...');
        const startTime = Date.now();

        const { searchParams } = new URL(request.url);
        const queryParams = Object.fromEntries(searchParams.entries());

        // Validate query parameters
        const validatedParams = getPublicRequestsSchema.parse(queryParams);

        // Build where clause - show all requests by default, filter by status if specified
        const where: any = {};

        if (validatedParams.category) where.category = validatedParams.category;
        if (validatedParams.status) where.status = validatedParams.status; // Allow filtering by status
        if (validatedParams.deliveryCity) {
            // Sanitize and normalize city input
            where.deliveryCity = {
                contains: validatedParams.deliveryCity.trim(),
                mode: 'insensitive' // Case-insensitive search
            };
        }

        console.log('🚀 [PUBLIC API] Fetching requests with filters:', where);

        // Optimized query with minimal data fetching
        const requests = await prisma.request.findMany({
            where,
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                quantity: true,
                estimatedValue: true,
                sourceCity: true,
                deliveryCity: true,
                status: true,
                dueDate: true,
                createdAt: true,
                requester: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                        totalRequests: true,
                        totalDeliveries: true,
                    }
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: validatedParams.limit || 20,
            skip: validatedParams.offset || 0,
        });

        console.log('🚀 [PUBLIC API] Fetched', requests.length, 'requests');

        // Get total count for pagination (optimized)
        const totalCount = await prisma.request.count({ where });

        const endTime = Date.now();
        console.log('🚀 [PUBLIC API] Request completed in', endTime - startTime, 'ms');

        return NextResponse.json({
            requests,
            pagination: {
                total: totalCount,
                limit: validatedParams.limit || 20,
                offset: validatedParams.offset || 0,
                hasMore: (validatedParams.offset || 0) + (validatedParams.limit || 20) < totalCount
            }
        });

    } catch (error) {
        console.error('❌ [PUBLIC API] Error fetching public requests:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 