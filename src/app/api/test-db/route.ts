import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Test basic connection
        const result = await prisma.$queryRaw`SELECT 1 as test`

        // Test if tables exist
        const tableCountResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as Array<{ count: bigint }>

        // Test NextAuth tables specifically
        const users = await prisma.user.findMany({
            take: 5
        })

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            data: {
                test: result,
                tableCount: Number(tableCountResult[0]?.count || 0),
                userCount: users.length,
                users: users
            }
        })

    } catch (error: any) {
        console.error('Database connection error:', error)

        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        }, { status: 500 })
    }
} 