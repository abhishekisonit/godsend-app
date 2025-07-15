import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticatedRequest | null> {
  try {
    console.log('🔐 [AUTH] Starting authentication process...');

    // First, try to get session from NextAuth
    const session = await getServerSession(authOptions);
    console.log('🔐 [AUTH] NextAuth session found:', !!session);
    console.log(
      '🔐 [AUTH] Session user email:',
      session?.user?.email || 'none'
    );

    if (session?.user?.email) {
      console.log('🔐 [AUTH] ✅ Using JWT session authentication path');

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (user && user.email) {
        console.log(
          '🔐 [AUTH] ✅ JWT authentication successful for user:',
          user.email
        );
        (request as AuthenticatedRequest).user = {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
        };
        return request as AuthenticatedRequest; // ✅ EARLY RETURN - JWT success
      } else {
        console.log(
          '🔐 [AUTH] ❌ JWT authentication failed - user not found in database'
        );
      }
    } else {
      console.log(
        '🔐 [AUTH] ⚠️ No NextAuth session found, checking for API key...'
      );
    }

    // Only check API key if no JWT session was found or JWT authentication failed
    const apiKey = request.headers.get('x-api-key');
    console.log('🔐 [AUTH] API key present:', !!apiKey);

    if (apiKey) {
      console.log('🔐 [AUTH] 🔑 Using API key authentication path');
      try {
        // Decode the session token
        const decodedToken = JSON.parse(
          Buffer.from(apiKey, 'base64').toString()
        );
        console.log(
          '🔐 [AUTH] API key decoded successfully for user:',
          decodedToken.email
        );

        // Check if token is expired
        if (decodedToken.exp && Date.now() > decodedToken.exp) {
          console.log(
            '🔐 [AUTH] ❌ API key authentication failed - token expired'
          );
          return null;
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
          where: { email: decodedToken.email },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });

        if (user && user.email) {
          console.log(
            '🔐 [AUTH] ✅ API key authentication successful for user:',
            user.email
          );
          (request as AuthenticatedRequest).user = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
          };
          return request as AuthenticatedRequest; // ✅ EARLY RETURN - API key success
        } else {
          console.log(
            '🔐 [AUTH] ❌ API key authentication failed - user not found in database'
          );
        }
      } catch (error) {
        console.error('🔐 [AUTH] ❌ Error decoding API key:', error);
        return null;
      }
    } else {
      console.log('🔐 [AUTH] ⚠️ No API key found in headers');
    }

    console.log(
      '🔐 [AUTH] ❌ Authentication failed - no valid session or API key'
    );
    return null;
  } catch (error) {
    console.error('🔐 [AUTH] ❌ Error in authenticateRequest:', error);
    return null;
  }
}

export function createAuthMiddleware() {
  return async function authMiddleware(
    request: NextRequest
  ): Promise<NextResponse | null> {
    console.log(
      '🔐 [AUTH] Middleware called for:',
      request.method,
      request.url
    );

    const authenticatedRequest = await authenticateRequest(request);

    if (!authenticatedRequest) {
      console.log('🔐 [AUTH] ❌ Authentication failed, returning 401');
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message:
            'Please authenticate using NextAuth session or valid API key',
        },
        { status: 401 }
      );
    }

    console.log(
      '🔐 [AUTH] ✅ Authentication successful, continuing to handler'
    );
    // Replace the request with authenticated version
    Object.assign(request, authenticatedRequest);
    return null; // Continue to the actual handler
  };
}
