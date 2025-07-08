import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '@/lib/auth'

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Find user by email (include password)
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        password: true,
                    },
                })

                if (!user || !user.password) {
                    // User not found or no password set
                    return null
                }

                // Verify password
                const isValid = await verifyPassword(credentials.password, user.password)
                if (!isValid) {
                    return null
                }

                // Return user object (omit password)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string
            }
            return session
        }
    }
})

export { handler as GET, handler as POST } 