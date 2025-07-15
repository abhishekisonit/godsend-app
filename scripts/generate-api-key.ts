import { NextRequest } from 'next/server';

// Helper function to create a test session token (API key)
function createTestSessionToken(email: string, name?: string): string {
  const sessionData = {
    id: `test-${Date.now()}`,
    email: email,
    name: name || 'Test User',
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  return Buffer.from(JSON.stringify(sessionData)).toString('base64');
}

// Function to authenticate and get API key
async function getApiKey(email: string, password: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/api/test-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Authentication failed: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.sessionToken;
  } catch (error) {
    console.error('Error getting API key:', error);
    throw error;
  }
}

// Main function
async function generateApiKey(email: string, password: string) {
  try {
    console.log(`🔐 Authenticating with email: ${email}`);

    const apiKey = await getApiKey(email, password);

    console.log('\n✅ Authentication successful!');
    console.log('\n📋 API Key (use this as API_KEY environment variable):');
    console.log('='.repeat(50));
    console.log(apiKey);
    console.log('='.repeat(50));

    console.log('\n💡 Usage:');
    console.log(`export API_KEY="${apiKey}"`);
    console.log('npm run create-sample-requests');

    return apiKey;
  } catch (error) {
    console.error('❌ Failed to generate API key:', error);
    throw error;
  }
}

// Export for use in other scripts
export { generateApiKey, createTestSessionToken };

// If this file is run directly
if (require.main === module) {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: tsx scripts/generate-api-key.ts <email> <password>');
    console.error(
      'Example: tsx scripts/generate-api-key.ts test@example.com password123'
    );
    process.exit(1);
  }

  generateApiKey(email, password)
    .then(() => {
      console.log('\n🎉 API key generation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}
