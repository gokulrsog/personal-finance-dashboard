import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.$transaction([
      prisma.chatMessage.deleteMany({ where: { userId: session.user.id } }),
      prisma.transaction.deleteMany({ where: { userId: session.user.id } }),
      prisma.budget.deleteMany({ where: { userId: session.user.id } }),
      prisma.goal.deleteMany({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error resetting user data:", error)
    return NextResponse.json({ error: "Failed to reset user data" }, { status: 500 })
  }
}