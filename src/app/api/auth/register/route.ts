import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                // Don't select password for security
            },
        })

        return NextResponse.json(
            {
                message: 'User created successfully',
                user
            },
            { status: 201 }
        )

    } catch (error: any) {
        console.error('Registration error:', error)

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: error.errors
                },
                { status: 400 }
            )
        }

        // Handle other errors
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 