import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// DELETE /api/requests/[id]/delete - Actually delete request from database
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        console.log('Authenticated user for DELETE:', user.email);

        const requestId = params.id;

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (!dbUser) {
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

        if (existingRequest.requesterId !== dbUser.id) {
            return NextResponse.json({ error: 'Not authorized to delete this request' }, { status: 403 });
        }

        // Actually delete the request from database
        await prisma.request.delete({
            where: { id: requestId }
        });

        // Update user's total requests count
        await prisma.user.update({
            where: { id: dbUser.id },
            data: { totalRequests: { decrement: 1 } }
        });

        return NextResponse.json({ message: 'Request deleted successfully' });

    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 