"use client"

import { useState } from "react"
import { Bot, Send, Sparkles, TrendingUp, PiggyBank, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const suggestions = [
  { icon: TrendingUp, text: "Analyze my spending" },
  { icon: PiggyBank, text: "Savings tips" },
  { icon: AlertCircle, text: "Budget alerts" },
]

const messages = [
  {
    role: "assistant",
    content: "Hello! I'm your AI financial assistant. I can help you analyze spending patterns, set budgets, and provide personalized savings recommendations.",
  },
  {
    role: "user",
    content: "How did I spend last month?",
  },
  {
    role: "assistant",
    content: "Last month you spent $8,230 total. Your biggest categories were: Housing (35%), Food & Dining (22%), and Shopping (18%). You're 12% under your monthly budget!",
  },
]

export function AIChatWidget() {
  const [input, setInput] = useState("")

  return (
    <div className="flex flex-col h-full rounded-2xl border border-glass-border bg-glass backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">FinanceAI Assistant</h3>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-chart-1 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-primary" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.text}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <suggestion.icon className="h-3 w-3" />
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
