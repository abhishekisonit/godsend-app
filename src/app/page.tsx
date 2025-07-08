"use client";

import { Button, Card, Input } from "@/components/ui"
import {
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Container,
  Heading,
  SimpleGrid
} from "@chakra-ui/react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <Container maxW="6xl" py={8}>
        {/* Header */}
        <Box textAlign="center" py={8}>
          <Heading as="h1" size="2xl" mb={4} color="gray.900">
            Frontend Boilerplate - Hybrid Approach
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Chakra UI components + CSS Modules for Notion-inspired design
          </Text>
        </Box>

        {/* Design System Showcase */}
        <Card variant="elevated" className={styles.showcaseCard}>
          <Box className={styles.showcaseContent}>
            <Heading as="h2" size="xl" mb={8} color="gray.900">
              Hybrid Design System Components
            </Heading>

            {/* Buttons */}
            <Box mb={8}>
              <Heading as="h3" size="lg" mb={4} color="gray.900">
                Buttons (Chakra + CSS Modules)
              </Heading>
              <div className={styles.buttonGrid}>
                <Button variant="primary" size="sm">Primary Small</Button>
                <Button variant="primary" size="md" loading>Loading</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="ghost" size="md">Ghost</Button>
                <Button variant="danger" size="md">Danger</Button>
                <Button variant="success" size="md">Success</Button>
                <Button variant="primary" size="md" disabled>Disabled</Button>
              </div>
            </Box>

            {/* Inputs */}
            <Box mb={8}>
              <Heading as="h3" size="lg" mb={4} color="gray.900">
                Inputs (Chakra + CSS Modules)
              </Heading>
              <div className={styles.inputGroup}>
                <Input
                  placeholder="Default input"
                  size="md"
                />
                <Input
                  placeholder="Error input"
                  variant="error"
                  size="md"
                />
                <Input
                  placeholder="Success input"
                  variant="success"
                  size="md"
                />
              </div>
            </Box>

            {/* Cards */}
            <Box mb={8}>
              <Heading as="h3" size="lg" mb={4} color="gray.900">
                Cards (Chakra + CSS Modules)
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Card
                  variant="elevated"
                  title="Elevated Card"
                  content="This card uses Chakra's Box component with our CSS Modules styling."
                />
                <Card
                  variant="outline"
                  title="Outline Card"
                  content="Clean border outline with Chakra's functionality."
                />
                <Card
                  variant="ghost"
                  title="Ghost Card"
                  content="No background or border, perfect for subtle grouping."
                />
                <Card
                  variant="elevated"
                  title="Interactive Card"
                  subtitle="Hover to see effects"
                  content="This card demonstrates Chakra props with our styling."
                  footer="Last updated 2 hours ago"
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="transform 0.2s"
                />
              </SimpleGrid>
            </Box>

            {/* Mixed Components */}
            <Box mb={8}>
              <Heading as="h3" size="lg" mb={4} color="gray.900">
                Mixed Components (Chakra + Custom)
              </Heading>
              <VStack gap={4} align="stretch">
                <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Chakra UI Components</Text>
                    <Badge colorScheme="blue">Available</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Use any Chakra component with our design system
                  </Text>
                </Box>

                <Card
                  variant="elevated"
                  title="Custom Components"
                  content="Our Button, Card, and Input components with Chakra functionality."
                />
              </VStack>
            </Box>

            {/* Color Palette */}
            <Box mb={8}>
              <Heading as="h3" size="lg" mb={4} color="gray.900">
                Color Palette
              </Heading>
              <div className={styles.colorPalette}>
                <div className={styles.colorRow}>
                  <div className={`${styles.colorSwatch} ${styles.primaryBlue}`}></div>
                  <div className={`${styles.colorSwatch} ${styles.primaryBlueLight}`}></div>
                  <div className={`${styles.colorSwatch} ${styles.primaryBlueLighter}`}></div>
                  <span className={styles.colorLabel}>Primary Colors (Notion Blue)</span>
                </div>
                <div className={styles.colorRow}>
                  <div className={`${styles.colorSwatch} ${styles.successGreen}`}></div>
                  <div className={`${styles.colorSwatch} ${styles.warningYellow}`}></div>
                  <div className={`${styles.colorSwatch} ${styles.dangerRed}`}></div>
                  <span className={styles.colorLabel}>Status Colors</span>
                </div>
              </div>
            </Box>

            {/* Spacing Scale */}
            <Box>
              <Heading as="h3" size="lg" mb={4} color="gray.900">
                Spacing Scale
              </Heading>
              <div className={styles.spacingScale}>
                <div className={`${styles.spacingBox} ${styles.spacing4}`}></div>
                <div className={`${styles.spacingBox} ${styles.spacing8}`}></div>
                <div className={`${styles.spacingBox} ${styles.spacing16}`}></div>
                <div className={`${styles.spacingBox} ${styles.spacing24}`}></div>
                <span className={styles.spacingLabel}>4px, 8px, 16px, 24px</span>
              </div>
            </Box>
          </Box>
        </Card>
      </Container>
    </div>
  )
}
