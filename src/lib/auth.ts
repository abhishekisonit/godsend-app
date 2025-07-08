import bcrypt from 'bcryptjs'

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12 // Recommended for production
    return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

/**
 * Generate a secure random password (for testing or password reset)
 * @param length - Length of the password (default: 12)
 * @returns Random password string
 */
export function generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        password += charset[randomIndex]
    }

    return password
} 