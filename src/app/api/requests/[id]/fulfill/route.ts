import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/requests/[id]/fulfill - Accept and fulfill a request
export async function POST(
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

        // Check if request exists and is open
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            include: {
                requester: true,
                fulfiller: true
            }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (existingRequest.status !== 'OPEN') {
            return NextResponse.json({ error: 'Request is not available for fulfillment' }, { status: 400 });
        }

        // Prevent users from fulfilling their own requests
        if (existingRequest.requesterId === user.id) {
            return NextResponse.json({ error: 'Cannot fulfill your own request' }, { status: 400 });
        }

        // Check if user is already fulfilling this request
        if (existingRequest.fulfillerId === user.id) {
            return NextResponse.json({ error: 'You are already fulfilling this request' }, { status: 400 });
        }

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Double-check request is still open (race condition protection)
            const currentRequest = await tx.request.findUnique({
                where: { id: requestId },
                select: { status: true, fulfillerId: true }
            });

            if (!currentRequest || currentRequest.status !== 'OPEN' || currentRequest.fulfillerId) {
                throw new Error('Request is no longer available');
            }

            // Update request status and assign fulfiller
            const updatedRequest = await tx.request.update({
                where: { id: requestId },
                data: {
                    status: 'IN_PROGRESS',
                    fulfillerId: user.id,
                },
                include: {
                    requester: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            location: true,
                        }
                    },
                    fulfiller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            location: true,
                        }
                    }
                }
            });

            // Update fulfiller's total deliveries count
            await tx.user.update({
                where: { id: user.id },
                data: { totalDeliveries: { increment: 1 } }
            });

            return updatedRequest;
        });

        return NextResponse.json({
            message: 'Request accepted successfully',
            request: result
        });

    } catch (error) {
        console.error('Error fulfilling request:', error);

        if (error instanceof Error && error.message === 'Request is no longer available') {
            return NextResponse.json({ error: 'Request is no longer available' }, { status: 409 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 