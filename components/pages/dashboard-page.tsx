"use client"

import { useState, useEffect } from "react"
import { PlusCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { AIChatWidget } from "@/components/dashboard/ai-chat-widget"
import type { PageType } from "@/components/main-app"

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [target])

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

interface DashboardPageProps {
  onNavigate: (page: PageType) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="xl:col-span-2 space-y-6">
        {/* Balance Card with Chart */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 border border-primary/30">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                  $<AnimatedCounter target={47852} />.39
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-chart-1/20 px-2 py-0.5 text-xs font-medium text-chart-1">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +12.5%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-1/20 text-chart-1">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Income</p>
                    <p className="text-sm font-semibold text-foreground">+$<AnimatedCounter target={12450} /></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-4/20 text-chart-4">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                    <p className="text-sm font-semibold text-foreground">-$<AnimatedCounter target={8230} /></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Chart */}
            <div className="mt-6">
              <BalanceChart />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Expense Breakdown</h3>
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <ExpenseChart />
          </div>

          {/* Quick Add Card */}
          <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="flex-1 flex flex-col justify-center gap-3">
              <Button
                onClick={() => onNavigate("add")}
                className="w-full justify-start gap-3 h-12 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                variant="outline"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Transaction
              </Button>
              <Button
                onClick={() => onNavigate("budgets")}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <TrendingUp className="h-5 w-5" />
                Set Budget Goal
              </Button>
              <Button
                onClick={() => onNavigate("analytics")}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <ArrowUpRight className="h-5 w-5" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <TransactionsList />
      </div>

      {/* Right Column - AI Chat */}
      <div className="xl:col-span-1">
        <div className="sticky top-24 h-[calc(100vh-8rem)]">
          <AIChatWidget />
        </div>
      </div>
    </div>
  )
}
