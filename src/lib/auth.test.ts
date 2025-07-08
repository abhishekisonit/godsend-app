import { hashPassword, verifyPassword, generateSecurePassword } from './auth'

// Simple test to verify bcrypt functions work
async function testBcryptFunctions() {
    console.log('🧪 Testing bcrypt functions...')

    // Test password hashing and verification
    const testPassword = 'testPassword123'
    const hashedPassword = await hashPassword(testPassword)

    console.log('✅ Password hashed successfully')
    console.log('📝 Original password:', testPassword)
    console.log('🔐 Hashed password:', hashedPassword)

    // Test password verification
    const isValid = await verifyPassword(testPassword, hashedPassword)
    const isInvalid = await verifyPassword('wrongPassword', hashedPassword)

    console.log('✅ Password verification test:', isValid ? 'PASSED' : 'FAILED')
    console.log('✅ Wrong password test:', !isInvalid ? 'PASSED' : 'FAILED')

    // Test secure password generation
    const securePassword = generateSecurePassword(16)
    console.log('🔑 Generated secure password:', securePassword)
    console.log('✅ Password length:', securePassword.length)

    console.log('🎉 All bcrypt tests completed!')
}

// Run the test if this file is executed directly
if (require.main === module) {
    testBcryptFunctions().catch(console.error)
}

export { testBcryptFunctions } 