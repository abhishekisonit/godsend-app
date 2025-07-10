import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createMessageSchema = z.object({
    content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
});

// GET /api/requests/[id]/messages - Get messages for a request
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

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if request exists and user is involved
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            select: { requesterId: true, fulfillerId: true }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Check if user is authorized to view messages (requester or fulfiller)
        if (existingRequest.requesterId !== user.id && existingRequest.fulfillerId !== user.id) {
            return NextResponse.json({ error: 'Not authorized to view messages for this request' }, { status: 403 });
        }

        // Get messages for the request
        const messages = await prisma.message.findMany({
            where: { requestId },
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
        });

        return NextResponse.json({ messages });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/requests/[id]/messages - Send a message
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
        const body = await request.json();

        // Validate message content
        const validatedData = createMessageSchema.parse(body);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if request exists and user is involved
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            select: { requesterId: true, fulfillerId: true, status: true }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Check if user is authorized to send messages (requester or fulfiller)
        if (existingRequest.requesterId !== user.id && existingRequest.fulfillerId !== user.id) {
            return NextResponse.json({ error: 'Not authorized to send messages for this request' }, { status: 403 });
        }

        // Only allow messages for active requests
        if (existingRequest.status === 'CANCELLED') {
            return NextResponse.json({ error: 'Cannot send messages for cancelled requests' }, { status: 400 });
        }

        // Create the message
        const newMessage = await prisma.message.create({
            data: {
                content: validatedData.content,
                requestId,
                senderId: user.id,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json(newMessage, { status: 201 });

    } catch (error) {
        console.error('Error sending message:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid message data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 