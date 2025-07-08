'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Box,
    Stack,
    Heading,
    Text,
    Container,
    Alert,
    Field,
} from '@chakra-ui/react'
import { Button, Input } from '@/components/ui'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Check for success message from registration
        const message = searchParams.get('message')
        if (message) {
            setSuccessMessage(message)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(email, password)
            router.push('/dashboard')
        } catch (error) {
            setError('Invalid email or password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxW="md" py={10}>
            <Stack gap={8}>
                <Box textAlign="center">
                    <Heading size="lg" mb={2}>Welcome Back</Heading>
                    <Text color="gray.600">Sign in to your account to continue</Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit} w="full">
                    <Stack gap={6}>
                        {successMessage && (
                            <Alert.Root status="success">
                                <Alert.Title>{successMessage}</Alert.Title>
                            </Alert.Root>
                        )}

                        {error && (
                            <Alert.Root status="error">
                                <Alert.Title>{error}</Alert.Title>
                            </Alert.Root>
                        )}

                        <Field.Root>
                            <Field.Label>Email Address</Field.Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Password</Field.Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </Field.Root>

                        <Button
                            type="submit"
                            variant="primary"
                            w="full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Stack>
                </Box>

                <Box textAlign="center">
                    <Text fontSize="sm" color="gray.600" mb={2}>
                        Don't have an account?
                    </Text>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/auth/signup')}
                    >
                        Create Account
                    </Button>
                </Box>

                <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Test Credentials
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Email: test@example.com
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Password: password
                    </Text>
                </Box>
            </Stack>
        </Container>
    )
} 