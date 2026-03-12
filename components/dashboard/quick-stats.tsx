"use client"

import { CreditCard, PiggyBank, Target, TrendingUp } from "lucide-react"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import {
  calculateExpenses,
  calculateIncome,
  computeBudgetSpent,
  getCurrentMonthTransactions,
  type BudgetRecord,
  type GoalRecord,
  type TransactionRecord,
} from "@/lib/finance"
import { cn } from "@/lib/utils"

interface QuickStatsProps {
  transactions: TransactionRecord[]
  budgets: BudgetRecord[]
  goals: GoalRecord[]
}

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  "chart-1": { bg: "bg-chart-1/15", text: "text-chart-1", icon: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/15", text: "text-chart-2", icon: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/15", text: "text-chart-3", icon: "text-chart-3" },
  primary: { bg: "bg-primary/15", text: "text-primary", icon: "text-primary" },
}

export function QuickStats({ transactions, budgets, goals }: QuickStatsProps) {
  const { formatCurrency } = useAppPreferences()
  const currentMonthTransactions = getCurrentMonthTransactions(transactions)
  const currentMonthIncome = calculateIncome(currentMonthTransactions)
  const currentMonthExpenses = calculateExpenses(currentMonthTransactions)
  const currentMonthBudgets = budgets.filter((budget) => {
    const now = new Date()
    const budgetDate = new Date(budget.month)
    return budgetDate.getMonth() === now.getMonth() && budgetDate.getFullYear() === now.getFullYear()
  })

  const totalBudget = currentMonthBudgets.reduce((sum, budget) => sum + budget.budget, 0)
  const usedBudget = currentMonthBudgets.reduce(
    (sum, budget) => sum + computeBudgetSpent(budget, transactions),
    0
  )
  const budgetUsage = totalBudget > 0 ? `${Math.round((usedBudget / totalBudget) * 100)}% used` : "None"
  const goalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const monthNet = currentMonthIncome - currentMonthExpenses

  const stats = [
    {
      label: "Transactions",
      value: `${currentMonthTransactions.length}`,
      change: currentMonthTransactions.length ? "This month" : "Add your first one",
      icon: CreditCard,
      color: "chart-2",
    },
    {
      label: "Budget Usage",
      value: budgetUsage,
      change: totalBudget > 0 ? `${formatCurrency(Math.max(totalBudget - usedBudget, 0))} left` : "Create a budget",
      icon: Target,
      color: "chart-3",
    },
    {
      label: "Goal Savings",
      value: formatCurrency(goalSavings),
      change: goals.length ? `${goals.length} active goals` : "No goals yet",
      icon: PiggyBank,
      color: "primary",
    },
    {
      label: "Net This Month",
      value: `${monthNet >= 0 ? "+" : "-"}${formatCurrency(Math.abs(monthNet))}`,
      change: currentMonthTransactions.length ? "Income minus expenses" : "Start tracking",
      icon: TrendingUp,
      color: "chart-1",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const colors = colorMap[stat.color]
        return (
          <div
            key={stat.label}
            className="group rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105", colors.bg)}>
                <stat.icon className={cn("h-5 w-5", colors.icon)} />
              </div>
              <span className={cn("text-xs font-medium", colors.text)}>{stat.change}</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
