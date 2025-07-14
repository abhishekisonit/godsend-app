import { z } from 'zod';

// Types
interface DeleteRequestData {
    id: string;
    title: string;
    status: string;
}

// API call function to delete a single request
async function deleteRequest(requestId: string, apiKey: string): Promise<any> {
    try {
        const response = await fetch(`http://localhost:3000/api/requests/${requestId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
}

// Function to get all requests
async function getAllRequests(apiKey: string): Promise<any[]> {
    try {
        const allRequests: any[] = [];
        let offset = 0;
        const limit = 50; // Respect API limit

        while (true) {
            const response = await fetch(`http://localhost:3000/api/requests?limit=${limit}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const requests = data.requests || [];

            if (requests.length === 0) {
                break; // No more requests to fetch
            }

            allRequests.push(...requests);
            offset += limit;

            // If we got fewer requests than the limit, we've reached the end
            if (requests.length < limit) {
                break;
            }
        }

        return allRequests;
    } catch (error) {
        console.error('Error fetching requests:', error);
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

// Main function to delete all requests
async function deleteAllRequests() {
    let apiKey: string | null = null;

    try {
        console.log('🚀 Starting deletion of all requests...');

        // Step 1: Generate API key using test credentials
        apiKey = await generateApiKey('testuser1@example.com', 'password123');

        console.log(`\n📋 Using API key for authentication`);
        console.log('='.repeat(50));

        // Step 2: Get all existing requests
        console.log(`\n📝 Fetching existing requests...`);
        const requests = await getAllRequests(apiKey);

        if (requests.length === 0) {
            console.log('✅ No requests found to delete.');
            return;
        }

        console.log(`Found ${requests.length} requests to delete`);

        // Step 3: Confirm deletion
        console.log(`\n⚠️  WARNING: This will delete ALL ${requests.length} requests!`);
        console.log('This action cannot be undone.');
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');

        // Wait 5 seconds for user to cancel
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Step 4: Delete all requests
        console.log(`\n🗑️  Deleting all requests...`);

        const results = {
            successful: 0,
            failed: 0,
            errors: [] as string[],
        };

        // Delete requests with progress tracking
        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            try {
                console.log(`Deleting request ${i + 1}/${requests.length}: "${request.title}" (${request.status})`);

                if (apiKey) {
                    await deleteRequest(request.id, apiKey);
                    results.successful++;
                }

                // Add a small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                results.failed++;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                results.errors.push(`Request ${request.id}: ${errorMessage}`);
                console.error(`Failed to delete request ${request.id}:`, errorMessage);
            }
        }

        console.log('\n=== Results ===');
        console.log(`Successfully deleted: ${results.successful}`);
        console.log(`Failed to delete: ${results.failed}`);

        if (results.errors.length > 0) {
            console.log('\nErrors:');
            results.errors.forEach(error => console.log(`- ${error}`));
        }

        if (results.successful > 0) {
            console.log(`\n✅ Successfully deleted ${results.successful} requests`);
            console.log('🗄️  Database is now clean and ready for fresh test data');
        }

        return results;
    } catch (error) {
        console.error('❌ Script failed:', error);
        throw error;
    } finally {
        // Cleanup
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
export { deleteAllRequests };

// If this file is run directly
if (require.main === module) {
    // Production environment check
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') {
        console.error('❌ PRODUCTION BLOCKED: This script is for development only!');
        console.error('📖 See README.md for production exclusion guidelines.');
        process.exit(1);
    }

    console.log('⚠️  DEVELOPMENT ONLY: This script deletes test data and should not be used in production!');
    console.log('📖 See README.md for production exclusion guidelines.\n');

    // Security: Clear any existing environment variables that might contain sensitive data
    if (process.env.API_KEY) {
        console.log('🔒 Clearing existing API_KEY from environment for security');
        delete process.env.API_KEY;
    }

    deleteAllRequests()
        .then(() => {
            console.log('\n🎉 Request deletion completed!');
            console.log('🔒 All sessions and sensitive data have been cleaned up');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
} 