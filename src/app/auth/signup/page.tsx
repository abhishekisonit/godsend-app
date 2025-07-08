'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { registerSchema, type RegisterInput } from '@/lib/validations'

export default function SignUpPage() {
    const [formData, setFormData] = useState<RegisterInput>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const router = useRouter()

    const handleInputChange = (field: keyof RegisterInput, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear field-specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validateForm = () => {
        console.log('🔍 Validating form data:', formData)
        try {
            registerSchema.parse(formData)
            console.log('✅ Validation passed')
            setErrors({})
            return true
        } catch (error: any) {
            console.log('❌ Validation failed:', error.errors)
            const newErrors: Record<string, string> = {}
            error.errors?.forEach((err: any) => {
                const field = err.path[0]
                newErrors[field] = err.message
                console.log(`Field "${field}" error:`, err.message)
            })
            setErrors(newErrors)
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('🚀 Form submitted')
        setSubmitError('')

        const isValid = validateForm()
        console.log('📊 Validation result:', isValid)

        if (!isValid) {
            console.log('🛑 Form validation failed, stopping submission')
            return
        }

        console.log('✅ Form validation passed, making API call')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error === 'User with this email already exists') {
                    setErrors({ email: 'This email is already registered' })
                } else if (data.details) {
                    // Handle validation errors from server
                    const newErrors: Record<string, string> = {}
                    data.details.forEach((err: any) => {
                        const field = err.path[0]
                        newErrors[field] = err.message
                    })
                    setErrors(newErrors)
                } else {
                    setSubmitError(data.error || 'Registration failed')
                }
                return
            }

            // Registration successful
            router.push('/auth/signin?message=Registration successful! Please sign in.')
        } catch (error) {
            setSubmitError('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxW="md" py={10}>
            <Stack gap={8}>
                <Box textAlign="center">
                    <Heading size="lg" mb={2}>Create Account</Heading>
                    <Text color="gray.600">Sign up to get started with your account</Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit} w="full">
                    <Stack gap={6}>
                        {submitError && (
                            <Alert.Root status="error">
                                <Alert.Title>{submitError}</Alert.Title>
                            </Alert.Root>
                        )}

                        <Field.Root>
                            <Field.Label>Full Name</Field.Label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                            {errors.name && (
                                <Text fontSize="sm" color="red.500" mt={1}>
                                    {errors.name}
                                </Text>
                            )}
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email Address</Field.Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && (
                                <Text fontSize="sm" color="red.500" mt={1}>
                                    {errors.email}
                                </Text>
                            )}
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Password</Field.Label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Create a password"
                                required
                            />
                            {errors.password && (
                                <Text fontSize="sm" color="red.500" mt={1}>
                                    {errors.password}
                                </Text>
                            )}
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                Must be at least 8 characters with uppercase, lowercase, and number
                            </Text>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Confirm Password</Field.Label>
                            <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                            {errors.confirmPassword && (
                                <Text fontSize="sm" color="red.500" mt={1}>
                                    {errors.confirmPassword}
                                </Text>
                            )}
                        </Field.Root>

                        <Button
                            type="submit"
                            variant="primary"
                            w="full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Stack>
                </Box>

                <Box textAlign="center">
                    <Text fontSize="sm" color="gray.600" mb={2}>
                        Already have an account?
                    </Text>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/auth/signin')}
                    >
                        Sign In
                    </Button>
                </Box>
            </Stack>
        </Container>
    )
} 