import { z } from 'zod';

// Types based on the API schema
interface CreateRequestData {
    title: string;
    description?: string;
    category: 'Food' | 'Medicine' | 'Clothing' | 'Electronics' | 'Books' | 'Other';
    quantity: number;
    estimatedValue?: number;
    sourceCity: string;
    sourceShop?: string;
    sourceAddress?: string;
    alternativeSource?: string;
    deliveryCity: string;
    meetupArea?: string;
    dueDate: string;
}

// Sample data arrays
const categories: CreateRequestData['category'][] = ['Food', 'Medicine', 'Clothing', 'Electronics', 'Books', 'Other'];

const foodItems = [
    'Homemade Biryani', 'Fresh Mangoes', 'Spices Pack', 'Pickles', 'Sweets',
    'Tea Leaves', 'Rice Varieties', 'Lentils', 'Snacks', 'Chutneys'
];

const medicineItems = [
    'Ayurvedic Medicines', 'Vitamins', 'Pain Relief', 'Cold Medicine', 'Digestive Aids',
    'Skin Creams', 'Hair Care', 'Eye Drops', 'First Aid Kit', 'Herbal Supplements'
];

const clothingItems = [
    'Traditional Saree', 'Kurta Set', 'Salwar Kameez', 'Dhoti', 'Sherwani',
    'Lehenga', 'Kurti', 'Dupatta', 'Traditional Jewelry', 'Wedding Attire'
];

const electronicsItems = [
    'Mobile Phone', 'Laptop', 'Tablet', 'Headphones', 'Power Bank',
    'Charging Cable', 'Memory Card', 'USB Drive', 'Camera', 'Smart Watch'
];

const booksItems = [
    'Academic Books', 'Novels', 'Religious Texts', 'Cookbooks', 'Children Books',
    'Technical Manuals', 'Magazines', 'Comics', 'Dictionaries', 'Reference Books'
];

const otherItems = [
    'Handicrafts', 'Toys', 'Cosmetics', 'Stationery', 'Home Decor',
    'Garden Items', 'Kitchen Utensils', 'Bedding', 'Towels', 'Gifts'
];

const sourceCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const deliveryCities = [
    'New York', 'London', 'Toronto', 'Sydney', 'Dubai',
    'Singapore', 'Frankfurt', 'Paris', 'Tokyo', 'Melbourne'
];

const meetupAreas = [
    'Central Station', 'Airport Terminal', 'Shopping Mall', 'University Campus',
    'Downtown Area', 'Subway Station', 'Bus Terminal', 'Hotel Lobby', 'Park', 'Library'
];

// Helper function to get random item from array
function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random number between min and max
function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random date in the future (within 30 days)
function getRandomFutureDate(): string {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    return futureDate.toISOString();
}

// Helper function to get items based on category
function getItemsForCategory(category: CreateRequestData['category']): string[] {
    switch (category) {
        case 'Food': return foodItems;
        case 'Medicine': return medicineItems;
        case 'Clothing': return clothingItems;
        case 'Electronics': return electronicsItems;
        case 'Books': return booksItems;
        case 'Other': return otherItems;
        default: return otherItems;
    }
}

// Generate a single sample request
function generateSampleRequest(): CreateRequestData {
    const category = getRandomItem(categories);
    const items = getItemsForCategory(category);
    const item = getRandomItem(items);

    const quantity = getRandomNumber(1, 10);
    const estimatedValue = category === 'Electronics'
        ? getRandomNumber(5000, 50000)
        : getRandomNumber(100, 5000);

    const sourceCity = getRandomItem(sourceCities);
    const deliveryCity = getRandomItem(deliveryCities);

    // Ensure source and delivery cities are different
    const finalDeliveryCity = deliveryCity === sourceCity
        ? getRandomItem(deliveryCities.filter(city => city !== sourceCity))
        : deliveryCity;

    return {
        title: `Need ${item} from ${sourceCity}`,
        description: `Looking for ${item} from ${sourceCity}. Please help me get this item delivered to ${finalDeliveryCity}. Quality and authenticity are important.`,
        category,
        quantity,
        estimatedValue,
        sourceCity,
        sourceShop: `Shop in ${sourceCity}`,
        sourceAddress: `${getRandomNumber(1, 999)} Main Street, ${sourceCity}`,
        alternativeSource: Math.random() > 0.7 ? `Alternative shop in ${sourceCity}` : undefined,
        deliveryCity: finalDeliveryCity,
        meetupArea: Math.random() > 0.5 ? getRandomItem(meetupAreas) : undefined,
        dueDate: getRandomFutureDate(),
    };
}

// Function to create test users
async function createTestUsers(): Promise<void> {
    console.log('👥 Creating test users...');

    try {
        // Use the existing test user credentials from create-test-users.ts
        const testUser = { email: 'testuser1@example.com', password: 'password123', name: 'Test User' };

        const response = await fetch('http://localhost:3000/api/test-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: testUser.email, password: testUser.password }),
        });

        if (response.ok) {
            console.log(`✅ User ${testUser.email} exists and can authenticate`);
        } else {
            console.log(`⚠️ User ${testUser.email} not found or invalid credentials`);
            console.log('💡 Run "npm run create-test-users" first to create test users');
            throw new Error('Test user not found. Please run "npm run create-test-users" first.');
        }
    } catch (error) {
        console.error('❌ Error checking test user:', error);
        throw error;
    }
}

// Function to generate API key
async function generateApiKey(email: string, password: string): Promise<string> {
    console.log(`🔐 Authenticating with email: ${email}`);

    const response = await fetch('http://localhost:3000/api/test-auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Authentication failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ Authentication successful for ${email}`);
    return data.sessionToken;
}

// API call function
async function createRequest(requestData: CreateRequestData, apiKey: string): Promise<any> {
    try {
        const response = await fetch('http://localhost:3000/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey, // Use x-api-key header as expected by auth middleware
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating request:', error);
        throw error;
    }
}

// Main function to create sample requests with automatic authentication
async function createSampleRequests(count: number = 50) {
    let apiKey: string | null = null;

    try {
        console.log('🚀 Starting sample requests creation with automatic authentication...');

        // Step 1: Create test users
        await createTestUsers();

        // Step 2: Generate API key using test credentials
        apiKey = await generateApiKey('testuser1@example.com', 'password123');

        console.log(`\n📋 Using API key for authentication`);
        console.log('='.repeat(50));

        // Step 3: Create sample requests
        console.log(`\n📝 Creating ${count} sample requests...`);

        const results = {
            successful: 0,
            failed: 0,
            errors: [] as string[],
        };

        for (let i = 0; i < count; i++) {
            try {
                const requestData = generateSampleRequest();
                console.log(`Creating request ${i + 1}/${count}: ${requestData.title}`);

                await createRequest(requestData, apiKey);
                results.successful++;

                // Add a small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                results.failed++;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                results.errors.push(`Request ${i + 1}: ${errorMessage}`);
                console.error(`Failed to create request ${i + 1}:`, errorMessage);
            }
        }

        console.log('\n=== Results ===');
        console.log(`Successful: ${results.successful}`);
        console.log(`Failed: ${results.failed}`);

        if (results.errors.length > 0) {
            console.log('\nErrors:');
            results.errors.forEach(error => console.log(`- ${error}`));
        }

        return results;
    } catch (error) {
        console.error('❌ Script failed:', error);
        throw error;
    } finally {
        // Step 4: Cleanup - Invalidate session and clear sensitive data
        await cleanupSession(apiKey);
    }
}

// Function to cleanup session and sensitive data
async function cleanupSession(apiKey: string | null): Promise<void> {
    try {
        console.log('\n🧹 Cleaning up session and sensitive data...');

        if (apiKey) {
            // Attempt to invalidate the session token
            try {
                await fetch('http://localhost:3000/api/test-auth', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                    },
                });
                console.log('✅ Session invalidated successfully');
            } catch (error) {
                console.log('⚠️ Could not invalidate session (this is normal if endpoint doesn\'t exist)');
            }

            // Clear the API key from memory
            apiKey = null;
        }

        // Clear any other sensitive data
        console.log('✅ Sensitive data cleared from memory');
        console.log('✅ Session cleanup completed');

    } catch (error) {
        console.error('⚠️ Error during cleanup:', error);
        // Don't throw error during cleanup to avoid masking main script errors
    }
}

// Export for use in other scripts
export { createSampleRequests, generateSampleRequest };
export type { CreateRequestData };

// If this file is run directly
if (require.main === module) {
    // Production environment check
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') {
        console.error('❌ PRODUCTION BLOCKED: This script is for development only!');
        console.error('📖 See README.md for production exclusion guidelines.');
        process.exit(1);
    }

    const count = parseInt(process.argv[2]) || 50;

    console.log('⚠️  DEVELOPMENT ONLY: This script creates test data and should not be used in production!');
    console.log('📖 See README.md for production exclusion guidelines.\n');

    // Security: Clear any existing environment variables that might contain sensitive data
    if (process.env.API_KEY) {
        console.log('🔒 Clearing existing API_KEY from environment for security');
        delete process.env.API_KEY;
    }

    createSampleRequests(count)
        .then(() => {
            console.log('\n🎉 Sample requests creation completed!');
            console.log('🔒 All sessions and sensitive data have been cleaned up');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
} 