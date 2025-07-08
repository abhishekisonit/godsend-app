'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
    Box,
    Stack,
    Heading,
    Text,
    Container,
    Alert,
} from '@chakra-ui/react'
import { Button, Card } from '@/components/ui'

interface DbTestResult {
    success: boolean
    message: string
    data?: any
    error?: string
}

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading, logout } = useAuth()
    const router = useRouter()
    const [dbStatus, setDbStatus] = useState<DbTestResult | null>(null)
    const [testingDb, setTestingDb] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/signin')
        }
    }, [isAuthenticated, isLoading, router])

    const testDatabase = async () => {
        setTestingDb(true)
        try {
            const response = await fetch('/api/test-db')
            const result = await response.json()
            setDbStatus(result)
        } catch (error: any) {
            setDbStatus({
                success: false,
                message: 'Failed to test database',
                error: error.message
            })
        } finally {
            setTestingDb(false)
        }
    }

    if (isLoading) {
        return (
            <Container maxW="lg" py={10}>
                <Text>Loading...</Text>
            </Container>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <Container maxW="lg" py={10}>
            <Stack gap={8}>
                <Box>
                    <Heading size="lg" mb={2}>Dashboard</Heading>
                    <Text color="gray.600">Welcome to your application dashboard</Text>
                </Box>

                <Card
                    title="User Information"
                    subtitle="Your account details"
                >
                    <Stack gap={3}>
                        <Box>
                            <Text fontWeight="medium" color="gray.700">Name</Text>
                            <Text>{user?.name || 'Not provided'}</Text>
                        </Box>
                        <Box>
                            <Text fontWeight="medium" color="gray.700">Email</Text>
                            <Text>{user?.email}</Text>
                        </Box>
                    </Stack>
                </Card>

                <Card
                    title="Database Connection"
                    subtitle="Test your database connectivity"
                >
                    <Stack gap={4}>
                        <Button
                            variant="primary"
                            onClick={testDatabase}
                            disabled={testingDb}
                            w="full"
                        >
                            {testingDb ? 'Testing...' : 'Test Database Connection'}
                        </Button>

                        {dbStatus && (
                            <Alert.Root status={dbStatus.success ? 'success' : 'error'}>
                                <Alert.Title>
                                    {dbStatus.success ? '✅ Connected' : '❌ Failed'}
                                </Alert.Title>
                                <Text fontSize="sm" mt={2}>
                                    {dbStatus.message}
                                </Text>
                                {dbStatus.error && (
                                    <Text fontSize="sm" color="red.500" mt={1}>
                                        Error: {dbStatus.error}
                                    </Text>
                                )}
                                {dbStatus.data && (
                                    <Text fontSize="sm" mt={1}>
                                        Tables: {dbStatus.data.tableCount || 0} |
                                        Users: {dbStatus.data.userCount || 0}
                                    </Text>
                                )}
                            </Alert.Root>
                        )}
                    </Stack>
                </Card>

                <Card
                    title="Account Actions"
                    subtitle="Manage your account"
                >
                    <Stack gap={3}>
                        <Button
                            variant="secondary"
                            w="full"
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="danger"
                            onClick={logout}
                            w="full"
                        >
                            Sign Out
                        </Button>
                    </Stack>
                </Card>
            </Stack>
        </Container>
    )
} 