import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
    try {
        console.log('Creating test users...');

        // Test User 1
        const user1Password = await bcrypt.hash('password123', 10);
        const user1 = await prisma.user.upsert({
            where: { email: 'testuser1@example.com' },
            update: {
                name: 'Test User 1',
                password: user1Password,
                rating: 4.5,
                totalRequests: 0,
                totalDeliveries: 0,
            },
            create: {
                email: 'testuser1@example.com',
                name: 'Test User 1',
                password: user1Password,
                rating: 4.5,
                totalRequests: 0,
                totalDeliveries: 0,
            },
        });

        // Test User 2
        const user2Password = await bcrypt.hash('password123', 10);
        const user2 = await prisma.user.upsert({
            where: { email: 'testuser2@example.com' },
            update: {
                name: 'Test User 2',
                password: user2Password,
                rating: 4.8,
                totalRequests: 0,
                totalDeliveries: 0,
            },
            create: {
                email: 'testuser2@example.com',
                name: 'Test User 2',
                password: user2Password,
                rating: 4.8,
                totalRequests: 0,
                totalDeliveries: 0,
            },
        });

        console.log('✅ Test users created successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('User 1:');
        console.log('  Email: testuser1@example.com');
        console.log('  Password: password123');
        console.log('\nUser 2:');
        console.log('  Email: testuser2@example.com');
        console.log('  Password: password123');
        console.log('\n🔗 Postman Authentication:');
        console.log('POST http://localhost:3000/api/test-auth');
        console.log('Body: { "email": "testuser1@example.com", "password": "password123" }');

    } catch (error) {
        console.error('❌ Error creating test users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
createTestUsers(); 