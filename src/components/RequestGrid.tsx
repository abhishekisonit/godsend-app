"use client";

import { useState, useEffect } from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Spinner,
    Center,
    HStack,
    Button,
    Input,
    VStack,
    Heading,
    Flex,
    Select,
    ButtonGroup,
    IconButton,
    Portal,
    createListCollection,
} from "@chakra-ui/react";
import RequestCard from "./RequestCard";

// Create collections for Select components
const categoryCollection = createListCollection({
    items: [
        { label: "All Categories", value: "" },
        { label: "Food", value: "Food" },
        { label: "Medicine", value: "Medicine" },
        { label: "Electronics", value: "Electronics" },
        { label: "Clothing", value: "Clothing" },
        { label: "Books", value: "Books" },
        { label: "Other", value: "Other" },
    ],
});

const statusCollection = createListCollection({
    items: [
        { label: "All Statuses", value: "" },
        { label: "Open", value: "OPEN" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
    ],
});

interface Request {
    id: string;
    title: string;
    description?: string;
    category: string;
    quantity: number;
    estimatedValue?: number;
    sourceCity: string;
    deliveryCity: string;
    status: string;
    dueDate: string;
    createdAt: string;
    _count?: {
        messages: number;
    };
}

interface PaginationData {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}

interface RequestGridProps {
    showFilters?: boolean;
}

export default function RequestGrid({ showFilters = true }: RequestGridProps) {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        limit: 12,
        offset: 0,
        hasMore: false,
    });
    const [filters, setFilters] = useState({
        category: "",
        status: "",
        deliveryCity: "",
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pagesCount = Math.ceil(pagination.total / pagination.limit);

    const fetchRequests = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters.category) params.append("category", filters.category);
            if (filters.status) params.append("status", filters.status);
            if (filters.deliveryCity) params.append("deliveryCity", filters.deliveryCity);

            // Add pagination parameters
            const offset = (page - 1) * pagination.limit;
            params.append("limit", pagination.limit.toString());
            params.append("offset", offset.toString());

            const response = await fetch(`/api/requests/public?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.statusText}`);
            }

            const data = await response.json();
            setRequests(data.requests || []);

            // Update pagination data
            if (data.pagination) {
                setPagination({
                    total: data.pagination.total,
                    limit: data.pagination.limit,
                    offset: data.pagination.offset,
                    hasMore: data.pagination.hasMore,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(currentPage);
    }, [filters, currentPage]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        // Reset to first page when filters change
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            status: "",
            deliveryCity: "",
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <Center py={12}>
                <VStack gap={4}>
                    <Spinner size="lg" color="blue.500" />
                    <Text color="gray.600">Loading requests...</Text>
                </VStack>
            </Center>
        );
    }

    if (error) {
        return (
            <Center py={12}>
                <Box p={6} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
                    <Text color="red.600" fontWeight="medium">Error: {error}</Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box>
            {/* Filters */}
            {showFilters && (
                <Box mb={8} p={6} bg="white" borderRadius="lg" shadow="sm">
                    <Heading size="md" mb={4}>Filter Requests</Heading>
                    <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
                        <Select.Root
                            collection={categoryCollection}
                            onValueChange={(details) => handleFilterChange("category", Array.isArray(details.value) ? details.value[0] || "" : details.value)}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select Category" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                    <Select.ClearTrigger />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {categoryCollection.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                {item.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>

                        <Select.Root
                            collection={statusCollection}
                            onValueChange={(details) => handleFilterChange("status", Array.isArray(details.value) ? details.value[0] || "" : details.value)}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select Status" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                    <Select.ClearTrigger />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {statusCollection.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                {item.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>

                        <Input
                            placeholder="Delivery City"
                            value={filters.deliveryCity}
                            onChange={(e) => handleFilterChange("deliveryCity", e.target.value)}
                        />

                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            size="md"
                        >
                            Clear Filters
                        </Button>
                    </SimpleGrid>
                </Box>
            )}

            {/* Results Count and Pagination Info */}
            <Flex justify="space-between" align="center" mb={6}>
                <Text color="gray.600">
                    Showing {requests.length} of {pagination.total} request{pagination.total !== 1 ? 's' : ''}
                </Text>
                {pagination.total > 0 && (
                    <Text color="gray.500" fontSize="sm">
                        Page {currentPage} of {pagesCount}
                    </Text>
                )}
            </Flex>

            {/* Requests Grid */}
            {requests.length === 0 ? (
                <Center py={12}>
                    <VStack gap={4}>
                        <Text fontSize="lg" color="gray.500">
                            No requests found
                        </Text>
                        <Text color="gray.400" textAlign="center">
                            Try adjusting your filters or check back later for new requests.
                        </Text>
                    </VStack>
                </Center>
            ) : (
                <>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
                        {requests.map((request) => (
                            <RequestCard key={request.id} request={request} />
                        ))}
                    </SimpleGrid>

                    {/* Pagination */}
                    {pagesCount > 1 && (
                        <Flex justify="center" mt={8}>
                            <HStack gap={2}>
                                <Button
                                    aria-label="Previous page"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    bg="white"
                                    color="gray.700"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    _hover={{
                                        bg: "gray.50",
                                        borderColor: "gray.300",
                                    }}
                                    _disabled={{
                                        opacity: 0.4,
                                        cursor: "not-allowed",
                                    }}
                                >
                                    ‹
                                </Button>

                                {/* Page numbers */}
                                {Array.from({ length: Math.min(5, pagesCount) }, (_, i) => {
                                    let pageNum;
                                    if (pagesCount <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= pagesCount - 2) {
                                        pageNum = pagesCount - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            disabled={loading}
                                            bg={currentPage === pageNum ? "blue.500" : "white"}
                                            color={currentPage === pageNum ? "white" : "gray.700"}
                                            border="1px solid"
                                            borderColor={currentPage === pageNum ? "blue.500" : "gray.200"}
                                            _hover={{
                                                bg: currentPage === pageNum ? "blue.600" : "gray.50",
                                                borderColor: currentPage === pageNum ? "blue.600" : "gray.300",
                                            }}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}

                                <Button
                                    aria-label="Next page"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagesCount || loading}
                                    bg="white"
                                    color="gray.700"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    _hover={{
                                        bg: "gray.50",
                                        borderColor: "gray.300",
                                    }}
                                    _disabled={{
                                        opacity: 0.4,
                                        cursor: "not-allowed",
                                    }}
                                >
                                    ›
                                </Button>
                            </HStack>
                        </Flex>
                    )}
                </>
            )}
        </Box>
    );
} 