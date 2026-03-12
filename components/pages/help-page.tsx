"use client"

import { Bot, CircleHelp, CreditCard, PiggyBank, Settings, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PageType } from "@/components/main-app"

interface HelpPageProps {
  onNavigate: (page: PageType) => void
}

const helpSections = [
  {
    icon: CreditCard,
    title: "Add and manage transactions",
    description: "Use Add Transaction to record income or expenses, then open Transactions to edit, filter, or delete entries.",
    actionLabel: "Open transactions",
    page: "transactions" as PageType,
  },
  {
    icon: Wallet,
    title: "Track budgets",
    description: "Create monthly budgets by category. If spending crosses a limit, Wealth Track will surface an in-app budget alert.",
    actionLabel: "Open budgets",
    page: "budgets" as PageType,
  },
  {
    icon: PiggyBank,
    title: "Build savings goals",
    description: "Create goals with a target amount and add funds over time to watch your progress update live.",
    actionLabel: "Open goals",
    page: "goals" as PageType,
  },
  {
    icon: Bot,
    title: "Use the AI assistant",
    description: "The chatbot works after you add your Anthropic API key and restart the app. It uses your own saved transactions and budgets as context.",
    actionLabel: "Open dashboard",
    page: "dashboard" as PageType,
  },
]

export function HelpPage({ onNavigate }: HelpPageProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <CircleHelp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Use this page to understand how Wealth Track works, where to enter your data, and how to enable the AI assistant.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {helpSections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border/50 bg-card p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/50 text-primary">
              <section.icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
            <Button variant="outline" className="mt-4 bg-transparent" onClick={() => onNavigate(section.page)}>
              {section.actionLabel}
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">AI setup</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>1. Open your `.env.local` file.</li>
            <li>2. Set `ANTHROPIC_API_KEY` to your real Anthropic key.</li>
            <li>3. Restart the development server after changing the key.</li>
            <li>4. Sign in and start chatting from the dashboard assistant panel.</li>
          </ol>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Settings tips</h2>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Choose a currency in Settings and every tracked amount will update to that format across the app.</li>
            <li>Switch between dark and light mode from Settings at any time.</li>
            <li>Reset Data removes only the signed-in user&apos;s transactions, budgets, goals, and chat history.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}