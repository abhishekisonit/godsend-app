import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        console.log('Test Auth - Full session:', session);
        console.log('Test Auth - Session user:', session?.user);
        console.log('Test Auth - Session email:', session?.user?.email);

        return NextResponse.json({
            authenticated: !!session?.user?.email,
            session: session,
            user: session?.user,
            message: session?.user?.email ? 'Authenticated' : 'Not authenticated'
        });

    } catch (error) {
        console.error('Test Auth Error:', error);
        return NextResponse.json({
            error: 'Authentication test failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 