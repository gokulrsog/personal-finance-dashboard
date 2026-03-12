"use client"

import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"

type BalanceCardProps = {
  balance?: number
  income?: number
  expenses?: number
  changeLabel?: string
}

export function BalanceCard({
  balance = 0,
  income = 0,
  expenses = 0,
  changeLabel = "Add transactions to see the month-over-month trend",
}: BalanceCardProps) {
  const { formatCurrency } = useAppPreferences()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 border border-primary/30">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              {formatCurrency(balance)}
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-6 flex gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-1/20 text-chart-1">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-sm font-semibold text-foreground">+{formatCurrency(income)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-4/20 text-chart-4">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-sm font-semibold text-foreground">-{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      </div>
    </div>
  )
}
