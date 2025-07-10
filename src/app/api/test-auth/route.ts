import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/test-auth - Get current session info for testing
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({
                authenticated: false,
                message: 'No active session found',
                debug: { session: session, user: session?.user }
            }, { status: 401 });
        }

        // Get user from database for additional info
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                rating: true,
                totalRequests: true,
                totalDeliveries: true,
            }
        });

        return NextResponse.json({
            authenticated: true,
            user: user,
            session: {
                user: session.user,
                expires: session.expires
            }
        });

    } catch (error) {
        console.error('Error in test-auth:', error);
        return NextResponse.json({
            error: 'Internal server error',
            authenticated: false
        }, { status: 500 });
    }
}

// POST /api/test-auth - Create a test session (for development only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({
                error: 'Email and password are required'
            }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
            }
        });

        if (!user || !user.password) {
            return NextResponse.json({
                error: 'Invalid credentials'
            }, { status: 401 });
        }

        // Import verifyPassword function
        const { verifyPassword } = await import('@/lib/auth');

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({
                error: 'Invalid credentials'
            }, { status: 401 });
        }

        // Create a simple session token (for testing purposes only)
        const sessionToken = Buffer.from(JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            iat: Date.now(),
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        })).toString('base64');

        return NextResponse.json({
            message: 'Authentication successful',
            sessionToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Error in test-auth POST:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
} 