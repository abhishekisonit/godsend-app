import { Card } from "@/components/ui";
import {
    Box,
    Text,
    Heading,
    Icon,
    Badge,
    HStack,
} from "@chakra-ui/react";
import {
    FaCalendarAlt,
    FaBox,
    FaMoneyBillWave,
    FaUser,
    FaComments
} from "react-icons/fa";
import styles from './RequestCard.module.css';

interface RequestCardProps {
    request: {
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
        requester?: {
            id: string;
            name?: string;
            rating?: number;
            totalRequests?: number;
            totalDeliveries?: number;
        };
        _count?: {
            messages: number;
        };
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'OPEN':
            return styles.statusOpen; // Green - Available for fulfillment
        case 'IN_PROGRESS':
            return styles.statusInProgress; // Blue - Being worked on
        case 'COMPLETED':
            return styles.statusCompleted; // Green - Successfully completed
        case 'CANCELLED':
            return styles.statusCancelled; // Red - Cancelled/terminated
        default:
            return styles.statusOpen;
    }
};

const formatStatusLabel = (status: string) => {
    switch (status) {
        case 'OPEN':
            return 'Open';
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'COMPLETED':
            return 'Completed';
        case 'CANCELLED':
            return 'Cancelled';
        default:
            return status;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
};

export default function RequestCard({ request }: RequestCardProps) {
    return (
        <Card
            variant="elevated"
            className={styles.requestCard}
        >
            <Box className={styles.cardContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.statusSection}>
                        <div className={`${styles.statusBadge} ${getStatusColor(request.status)}`}>
                            {formatStatusLabel(request.status)}
                        </div>
                    </div>
                    <div className={styles.categoryTimeSection}>
                        <Text className={styles.categoryText}>{request.category}</Text>
                        <Text className={styles.createdAt}>
                            {formatTimeAgo(request.createdAt)}
                        </Text>
                    </div>
                </div>

                {/* Title */}
                <Heading className={styles.title}>
                    {request.title}
                </Heading>

                {/* Description */}
                {request.description && (
                    <Text className={styles.description}>
                        {request.description}
                    </Text>
                )}

                {/* Details Grid */}
                <div className={styles.detailsGrid}>
                    {/* Quantity and Value */}
                    <div className={styles.detailRow}>
                        <div className={styles.detailItem}>
                            <Icon as={FaBox} color="gray.500" />
                            <Text className={styles.detailText}>
                                Qty: {request.quantity}
                            </Text>
                        </div>
                        {request.estimatedValue && (
                            <div className={styles.detailItem}>
                                <Icon as={FaMoneyBillWave} color="gray.500" />
                                <Text className={styles.detailText}>
                                    ₹{request.estimatedValue}
                                </Text>
                            </div>
                        )}
                    </div>

                    {/* Source and Delivery */}
                    <div className={styles.locationSection}>
                        <Text className={styles.locationValue}>
                            {request.sourceCity}
                        </Text>
                        <div className={styles.locationLine}></div>
                        <Text className={styles.locationValue}>
                            {request.deliveryCity}
                        </Text>
                    </div>

                    {/* Due Date */}
                    <div className={styles.detailItem}>
                        <Icon as={FaCalendarAlt} color="gray.500" />
                        <Text className={styles.detailText}>
                            Due: {formatDate(request.dueDate)}
                        </Text>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.footerItem}>
                        <Icon as={FaUser} color="gray.500" />
                        <Badge colorScheme="blue" variant="subtle">
                            {request._count?.messages || 0}
                        </Badge>
                    </div>
                    <HStack gap={1}>
                        <Badge colorScheme="purple" variant="subtle">
                            #{request.id.slice(-8)}
                        </Badge>
                    </HStack>
                </div>
            </Box>
        </Card>
    );
} 