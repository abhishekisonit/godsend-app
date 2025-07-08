'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const login = async (email: string, password: string) => {
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                throw new Error(result.error)
            }

            return result
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        await signOut({ redirect: false })
        router.push('/auth/signin')
    }

    const isAuthenticated = status === 'authenticated'
    const isLoading = status === 'loading'

    return {
        user: session?.user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    }
} 