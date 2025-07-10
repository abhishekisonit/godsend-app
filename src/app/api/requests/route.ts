import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/auth-middleware';

// Validation schemas
const createRequestSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().optional(),
    category: z.enum(['Food', 'Medicine', 'Clothing', 'Electronics', 'Books', 'Other']),
    quantity: z.number().int().positive('Quantity must be positive'),
    estimatedValue: z.number().positive().optional(),
    sourceCity: z.string().min(1, 'Source city is required'),
    sourceShop: z.string().optional(),
    sourceAddress: z.string().optional(),
    alternativeSource: z.string().optional(),
    deliveryCity: z.string().min(1, 'Delivery city is required'),
    meetupArea: z.string().optional(),
    dueDate: z.string().datetime('Invalid date format'),
});

const getRequestsSchema = z.object({
    category: z.enum(['Food', 'Medicine', 'Clothing', 'Electronics', 'Books', 'Other']).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    deliveryCity: z.string().optional(),
    limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(50)).optional(),
    offset: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
});

// GET /api/requests - List requests with filters
export async function GET(request: NextRequest) {
    try {
        // Use the new authentication middleware
        const authenticatedRequest = await authenticateRequest(request);

        if (!authenticatedRequest) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Please authenticate using NextAuth session or valid API key'
            }, { status: 401 });
        }

        const user = authenticatedRequest.user!;
        console.log('Authenticated user:', user.email);

        const { searchParams } = new URL(request.url);
        const queryParams = Object.fromEntries(searchParams.entries());

        // Validate query parameters
        const validatedParams = getRequestsSchema.parse(queryParams);

        // Build where clause
        const where: any = {};
        if (validatedParams.category) where.category = validatedParams.category;
        if (validatedParams.status) where.status = validatedParams.status;
        if (validatedParams.deliveryCity) where.deliveryCity = validatedParams.deliveryCity;

        // Get requests with pagination
        const requests = await prisma.request.findMany({
            where,
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        rating: true,
                        totalRequests: true,
                        totalDeliveries: true,
                    }
                },
                fulfiller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        rating: true,
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

        // Get total count for pagination
        const totalCount = await prisma.request.count({ where });

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
        console.error('Error fetching requests:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/requests - Create new request
export async function POST(request: NextRequest) {
    try {
        // Use the new authentication middleware
        const authenticatedRequest = await authenticateRequest(request);

        if (!authenticatedRequest) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Please authenticate using NextAuth session or valid API key'
            }, { status: 401 });
        }

        const user = authenticatedRequest.user!;
        console.log('Authenticated user for POST:', user.email);

        const body = await request.json();

        // Validate request body
        const validatedData = createRequestSchema.parse(body);

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create the request
        const newRequest = await prisma.request.create({
            data: {
                ...validatedData,
                dueDate: new Date(validatedData.dueDate),
                requesterId: dbUser.id,
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        rating: true,
                    }
                }
            }
        });

        // Update user's total requests count
        await prisma.user.update({
            where: { id: dbUser.id },
            data: { totalRequests: { increment: 1 } }
        });

        return NextResponse.json(newRequest, { status: 201 });

    } catch (error) {
        console.error('Error creating request:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 