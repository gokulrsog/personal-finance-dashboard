import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { type Prisma } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/analytics/spending - Get spending by category and time
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: Prisma.TransactionWhereInput = {
      userId: session.user.id,
      type: "expense",
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      where.date = {
        gte: thirtyDaysAgo,
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
    })

    // Group by category
    const byCategory: Record<string, number> = {}
    transactions.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })

    // Group by time period
    const byTime: Record<string, { income: number; expense: number }> = {}

    const allTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: where.date,
      },
    })

    allTransactions.forEach((t) => {
      const dateKey = t.date.toISOString().split("T")[0]
      if (!byTime[dateKey]) {
        byTime[dateKey] = { income: 0, expense: 0 }
      }
      if (t.type === "income") {
        byTime[dateKey].income += t.amount
      } else {
        byTime[dateKey].expense += t.amount
      }
    })

    return NextResponse.json({
      byCategory,
      byTime,
      totalIncome: allTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpense: allTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
