import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Anthropic } from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const defaultAnthropicModels = [
  "claude-sonnet-4-5",
  "claude-3-7-sonnet-latest",
  "claude-3-5-sonnet-latest",
]

const configuredAnthropicModels = (process.env.ANTHROPIC_MODEL || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)

const candidateAnthropicModels = Array.from(new Set([...configuredAnthropicModels, ...defaultAnthropicModels]))

type AnthropicErrorLike = {
  status?: number
  message?: string
}

function getAnthropicErrorDetails(error: unknown): AnthropicErrorLike {
  if (!error || typeof error !== "object") {
    return {}
  }

  const candidate = error as { status?: unknown; message?: unknown }

  return {
    status: typeof candidate.status === "number" ? candidate.status : undefined,
    message: typeof candidate.message === "string" ? candidate.message : undefined,
  }
}

async function createAnthropicMessage(systemPrompt: string, message: string) {
  let lastError: unknown

  for (const model of candidateAnthropicModels) {
    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      })

      return response
    } catch (error: unknown) {
      const { status, message: parsedMessage } = getAnthropicErrorDetails(error)
      const errorMessage = String(parsedMessage || "")
      const isModelUnavailable =
        status === 404 ||
        errorMessage.includes("not_found_error") ||
        errorMessage.includes("model:")

      if (!isModelUnavailable) {
        throw error
      }

      lastError = error
    }
  }

  throw lastError || new Error("No compatible Anthropic model is available for this API key")
}

// POST /api/ai/chat - Send message to AI assistant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI assistant is not configured. Please set ANTHROPIC_API_KEY." },
        { status: 500 }
      )
    }

    if (candidateAnthropicModels.length === 0) {
      return NextResponse.json(
        { error: "AI assistant is not configured. Please set ANTHROPIC_MODEL." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const message = typeof body?.message === "string" ? body.message.trim() : ""

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Get user's recent transactions for context
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 20,
    })

    // Get user's budgets for context
    const budgets = await prisma.budget.findMany({
      where: { userId },
    })

    // Build context from user's financial data
    const transactionSummary = recentTransactions.map(t => 
      `${t.description}: $${t.amount} (${t.category}, ${t.type})`
    ).join("\n")

    const budgetSummary = budgets.map(b =>
      `${b.category}: $${b.spent} / $${b.budget}`
    ).join("\n")

    const systemPrompt = `You are a helpful personal finance assistant. Help the user manage their finances, provide insights about their spending patterns, and give practical budgeting advice.

User's recent transactions:
${transactionSummary || "No transactions yet"}

User's current budgets:
${budgetSummary || "No budgets set"}

Provide concise, actionable financial advice. Be supportive and non-judgmental.`

    const response = await createAnthropicMessage(systemPrompt, message)

    const assistantMessage = response.content[0]?.type === "text" ? response.content[0].text : ""

    // Save messages to database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: "user",
        content: message,
      },
    })

    await prisma.chatMessage.create({
      data: {
        userId,
        role: "assistant",
        content: assistantMessage,
      },
    })

    return NextResponse.json({
      message: assistantMessage,
    })
  } catch (error: unknown) {
    console.error("Error in AI chat:", error)

    const { status, message: parsedMessage } = getAnthropicErrorDetails(error)
    const errorMessage = String(parsedMessage || "")
    
    // Provide helpful error message if API key is not set
    if (errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "AI assistant is not configured. Please set ANTHROPIC_API_KEY." },
        { status: 500 }
      )
    }

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: "Anthropic rejected the API key. Please check key permissions and billing." },
        { status: 500 }
      )
    }

    if (status === 429) {
      return NextResponse.json(
        { error: "Anthropic rate limit reached. Please retry in a moment." },
        { status: 429 }
      )
    }

    if (status === 404 || errorMessage.includes("not_found_error") || errorMessage.includes("model:")) {
      return NextResponse.json(
        { error: "Anthropic model is unavailable for this key. Update ANTHROPIC_MODEL in .env.local." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}

// GET /api/ai/chat - Get chat history
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 50,
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    )
  }
}
