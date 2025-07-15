'use client';

import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import RequestGrid from '@/components/RequestGrid';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <VStack gap={6} mb={8} textAlign="center">
          <Heading as="h1" size="2xl" color="gray.900">
            Godsend
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Connect with people who can help you get what you need. Find
            requests from your community or create your own.
          </Text>
        </VStack>

        {/* Requests Grid */}
        <RequestGrid showFilters={true} />
      </Container>
    </div>
  );
}
