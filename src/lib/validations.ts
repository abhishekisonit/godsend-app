import { z } from 'zod'

// User registration schema
export const registerSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
        .transform((val) => {
            console.log('🔐 Password validation:', val, 'Length:', val.length)
            return val
        }),
    confirmPassword: z.string()
        .min(1, 'Please confirm your password'),
}).refine((data) => {
    console.log('🔄 Password confirmation check:', data.password, '===', data.confirmPassword)
    return data.password === data.confirmPassword
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

// User login schema
export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(1, 'Password is required'),
})

// User profile update schema
export const profileSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .optional(),
    email: z.string()
        .email('Invalid email address')
        .optional(),
})

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema> 