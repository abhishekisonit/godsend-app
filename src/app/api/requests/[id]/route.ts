import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const updateRequestSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
    description: z.string().optional(),
    category: z.enum(['Food', 'Medicine', 'Clothing', 'Electronics', 'Books', 'Other']).optional(),
    quantity: z.number().int().positive('Quantity must be positive').optional(),
    estimatedValue: z.number().positive().optional(),
    sourceCity: z.string().min(1, 'Source city is required').optional(),
    sourceShop: z.string().optional(),
    sourceAddress: z.string().optional(),
    alternativeSource: z.string().optional(),
    deliveryCity: z.string().min(1, 'Delivery city is required').optional(),
    meetupArea: z.string().optional(),
    dueDate: z.string().datetime('Invalid date format').optional(),
});

// GET /api/requests/[id] - Get specific request
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestId = params.id;

        const request = await prisma.request.findUnique({
            where: { id: requestId },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        rating: true,
                        totalRequests: true,
                        totalDeliveries: true,
                        phone: true,
                        location: true,
                    }
                },
                fulfiller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        rating: true,
                        phone: true,
                        location: true,
                    }
                },
                messages: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            }
        });

        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json(request);

    } catch (error) {
        console.error('Error fetching request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/requests/[id] - Update request
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestId = params.id;
        const body = await request.json();

        // Validate request body
        const validatedData = updateRequestSchema.parse(body);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if request exists and user owns it
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            include: { requester: true }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (existingRequest.requesterId !== user.id) {
            return NextResponse.json({ error: 'Not authorized to update this request' }, { status: 403 });
        }

        // Only allow updates if request is still open
        if (existingRequest.status !== 'OPEN') {
            return NextResponse.json({ error: 'Cannot update request that is not open' }, { status: 400 });
        }

        // Prepare update data
        const updateData: any = { ...validatedData };
        if (validatedData.dueDate) {
            updateData.dueDate = new Date(validatedData.dueDate);
        }

        // Update the request
        const updatedRequest = await prisma.request.update({
            where: { id: requestId },
            data: updateData,
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

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error('Error updating request:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/requests/[id] - Cancel request
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestId = params.id;

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if request exists and user owns it
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            include: { requester: true }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (existingRequest.requesterId !== user.id) {
            return NextResponse.json({ error: 'Not authorized to cancel this request' }, { status: 403 });
        }

        // Only allow cancellation if request is still open
        if (existingRequest.status !== 'OPEN') {
            return NextResponse.json({ error: 'Cannot cancel request that is not open' }, { status: 400 });
        }

        // Cancel the request
        await prisma.request.update({
            where: { id: requestId },
            data: { status: 'CANCELLED' }
        });

        // Update user's total requests count
        await prisma.user.update({
            where: { id: user.id },
            data: { totalRequests: { decrement: 1 } }
        });

        return NextResponse.json({ message: 'Request cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 