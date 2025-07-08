"use client";

import { Button, Card, Input } from "@/components/ui"
import {
    VStack,
    HStack,
    Text,
    Badge,
    Box
} from "@chakra-ui/react"

export function ComplexComponentsExample() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900">
                Chakra UI Components + Our Custom Components
            </h2>

            {/* Mixed Components */}
            <Card variant="elevated" title="Mixed Components">
                <VStack gap={4} align="stretch">
                    <HStack justify="space-between">
                        <Text fontWeight="semibold">Our Custom Components</Text>
                        <Badge colorScheme="green">Working</Badge>
                    </HStack>

                    <HStack gap={2}>
                        <Button variant="primary" size="sm">Primary</Button>
                        <Button variant="secondary" size="sm">Secondary</Button>
                        <Button variant="ghost" size="sm">Ghost</Button>
                    </HStack>

                    <Input placeholder="Custom styled input" />

                    <Text fontSize="sm" color="gray.600">
                        All Chakra functionality works with our custom styling!
                    </Text>
                </VStack>
            </Card>

            {/* Layout Components */}
            <Card variant="elevated" title="Layout Components">
                <VStack gap={4} align="stretch">
                    <HStack justify="space-between" p={4} bg="gray.50" borderRadius="md">
                        <Text fontWeight="semibold">Chakra Layout</Text>
                        <Badge colorScheme="blue">VStack & HStack</Badge>
                    </HStack>

                    <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                        <Text mb={2} fontWeight="semibold">Box Component</Text>
                        <Text fontSize="sm" color="gray.600">
                            Chakra's Box component with our design system
                        </Text>
                    </Box>

                    <HStack gap={2}>
                        <Button variant="primary" size="sm">Custom Button</Button>
                        <Badge colorScheme="green">Chakra Badge</Badge>
                    </HStack>
                </VStack>
            </Card>

            {/* Form Example */}
            <Card variant="elevated" title="Form Example">
                <VStack gap={4} align="stretch">
                    <Box>
                        <Text mb={2} fontWeight="semibold">Name</Text>
                        <Input placeholder="Enter your name" />
                    </Box>

                    <Box>
                        <Text mb={2} fontWeight="semibold">Email</Text>
                        <Input placeholder="Enter your email" type="email" />
                    </Box>

                    <Box>
                        <Text mb={2} fontWeight="semibold">Status</Text>
                        <HStack gap={2}>
                            <Badge colorScheme="blue">In Progress</Badge>
                            <Text fontSize="sm" color="gray.600">75% complete</Text>
                        </HStack>
                    </Box>

                    <HStack gap={2} justify="flex-end">
                        <Button variant="secondary" size="sm">Cancel</Button>
                        <Button variant="primary" size="sm">Submit</Button>
                    </HStack>
                </VStack>
            </Card>
        </div>
    )
} 