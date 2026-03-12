"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Bot, PiggyBank, Send, Sparkles, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const suggestions = [
  { icon: TrendingUp, text: "Analyze my spending" },
  { icon: PiggyBank, text: "Savings tips" },
  { icon: AlertCircle, text: "Budget alerts" },
]

interface Message {
  role: "user" | "assistant"
  content: string
}

const starterMessage: Message = {
  role: "assistant",
  content:
    "Hello! I'm your Wealth Track AI assistant. Add your own transactions and budgets, then ask me for spending analysis, budget guidance, or savings ideas.",
}

export function AIChatWidget() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([starterMessage])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      const response = await fetch("/api/ai/chat", { cache: "no-store" })
      if (!response.ok) return

      const data = await response.json()
      if (!isMounted) return

      if (Array.isArray(data) && data.length > 0) {
        setMessages(data.map((message) => ({ role: message.role, content: message.content })))
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSendMessage(text?: string) {
    const messageText = (text || input).trim()
    if (!messageText) return

    setMessages((previous) => [...previous, { role: "user", content: messageText }])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to get AI response")
      }

      setMessages((previous) => [...previous, { role: "assistant", content: payload.message }])
    } catch (error) {
      const message = error instanceof Error ? error.message : "The assistant is unavailable right now."
      setMessages((previous) => [...previous, { role: "assistant", content: message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-border/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Wealth Track AI</h3>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-chart-1 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                message.role === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-secondary text-secondary-foreground"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-secondary" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-secondary" style={{ animationDelay: "0.2s" }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-secondary" style={{ animationDelay: "0.4s" }} />
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 ? (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                onClick={() => handleSendMessage(suggestion.text)}
                disabled={loading}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                <suggestion.icon className="h-3 w-3" />
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) {
                event.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask about your finances..."
            disabled={loading}
            className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
