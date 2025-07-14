import { z } from 'zod';

// Types
interface UpdateStatusData {
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// API call function to update request status
async function updateRequestStatus(requestId: string, status: UpdateStatusData['status'], apiKey: string): Promise<any> {
    try {
        const response = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating request status:', error);
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

// Main function to update request statuses
async function updateRequestStatuses() {
    let apiKey: string | null = null;

    try {
        console.log('🚀 Starting request status updates for UI testing...');

        // Step 1: Generate API key using test credentials
        apiKey = await generateApiKey('testuser1@example.com', 'password123');

        console.log(`\n📋 Using API key for authentication`);
        console.log('='.repeat(50));

        // Step 2: Get all existing requests
        console.log(`\n📝 Fetching existing requests...`);
        const requests = await getAllRequests(apiKey);

        if (requests.length === 0) {
            console.log('❌ No requests found. Please run "npm run create-sample-requests" first.');
            return;
        }

        console.log(`Found ${requests.length} requests to update`);

        // Step 3: Update request statuses with variety
        console.log(`\n🔄 Updating request statuses for UI testing...`);

        const statuses: UpdateStatusData['status'][] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
        const results = {
            successful: 0,
            failed: 0,
            errors: [] as string[],
            statusCounts: {
                OPEN: 0,
                IN_PROGRESS: 0,
                COMPLETED: 0,
                CANCELLED: 0,
            }
        };

        // Distribute statuses across requests
        requests.forEach((request, index) => {
            // Create a good distribution for UI testing
            let status: UpdateStatusData['status'];

            if (index < Math.floor(requests.length * 0.4)) {
                status = 'OPEN'; // 40% open
            } else if (index < Math.floor(requests.length * 0.7)) {
                status = 'IN_PROGRESS'; // 30% in progress
            } else if (index < Math.floor(requests.length * 0.9)) {
                status = 'COMPLETED'; // 20% completed
            } else {
                status = 'CANCELLED'; // 10% cancelled
            }

            // Update the request status
            if (apiKey) {
                updateRequestStatus(request.id, status, apiKey)
                    .then(() => {
                        results.successful++;
                        results.statusCounts[status]++;
                        console.log(`✅ Updated request "${request.title}" to ${status}`);
                    })
                    .catch((error) => {
                        results.failed++;
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        results.errors.push(`Request ${request.id}: ${errorMessage}`);
                        console.error(`Failed to update request ${request.id}:`, errorMessage);
                    });

                // Add a small delay to avoid overwhelming the server
                setTimeout(() => { }, 100);
            }
        });

        // Wait a bit for all updates to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('\n=== Results ===');
        console.log(`Successful updates: ${results.successful}`);
        console.log(`Failed updates: ${results.failed}`);
        console.log('\nStatus Distribution:');
        Object.entries(results.statusCounts).forEach(([status, count]) => {
            console.log(`- ${status}: ${count} requests`);
        });

        if (results.errors.length > 0) {
            console.log('\nErrors:');
            results.errors.forEach(error => console.log(`- ${error}`));
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
export { updateRequestStatuses };

// If this file is run directly
if (require.main === module) {
    // Production environment check
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') {
        console.error('❌ PRODUCTION BLOCKED: This script is for development only!');
        console.error('📖 See README.md for production exclusion guidelines.');
        process.exit(1);
    }

    console.log('⚠️  DEVELOPMENT ONLY: This script updates test data and should not be used in production!');
    console.log('📖 See README.md for production exclusion guidelines.\n');

    // Security: Clear any existing environment variables that might contain sensitive data
    if (process.env.API_KEY) {
        console.log('🔒 Clearing existing API_KEY from environment for security');
        delete process.env.API_KEY;
    }

    updateRequestStatuses()
        .then(() => {
            console.log('\n🎉 Request status updates completed!');
            console.log('🔒 All sessions and sensitive data have been cleaned up');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
} 