"use client"

import { useState } from "react"
import {
  Plus,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Gamepad2,
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const budgets = [
  {
    id: 1,
    category: "Housing",
    icon: Home,
    budget: 2000,
    spent: 1500,
    color: "primary",
  },
  {
    id: 2,
    category: "Food & Dining",
    icon: Utensils,
    budget: 800,
    spent: 720,
    color: "chart-2",
  },
  {
    id: 3,
    category: "Transport",
    icon: Car,
    budget: 400,
    spent: 280,
    color: "chart-3",
  },
  {
    id: 4,
    category: "Shopping",
    icon: ShoppingBag,
    budget: 500,
    spent: 520,
    color: "chart-4",
  },
  {
    id: 5,
    category: "Entertainment",
    icon: Gamepad2,
    budget: 300,
    spent: 150,
    color: "chart-5",
  },
  {
    id: 6,
    category: "Healthcare",
    icon: Heart,
    budget: 200,
    spent: 85,
    color: "destructive",
  },
  {
    id: 7,
    category: "Utilities",
    icon: Zap,
    budget: 250,
    spent: 230,
    color: "muted-foreground",
  },
]

const colorMap: Record<string, { bg: string; text: string; progress: string }> = {
  primary: { bg: "bg-primary/20", text: "text-primary", progress: "bg-primary" },
  "chart-2": { bg: "bg-chart-2/20", text: "text-chart-2", progress: "bg-chart-2" },
  "chart-3": { bg: "bg-chart-3/20", text: "text-chart-3", progress: "bg-chart-3" },
  "chart-4": { bg: "bg-chart-4/20", text: "text-chart-4", progress: "bg-chart-4" },
  "chart-5": { bg: "bg-chart-5/20", text: "text-chart-5", progress: "bg-chart-5" },
  destructive: { bg: "bg-destructive/20", text: "text-destructive", progress: "bg-destructive" },
  "muted-foreground": { bg: "bg-muted", text: "text-muted-foreground", progress: "bg-muted-foreground" },
}

export function BudgetsPage() {
  const [selectedMonth] = useState("January 2024")

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <p className="text-sm text-muted-foreground">{selectedMonth}</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <Plus className="h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-xl font-bold text-foreground">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20 text-chart-4">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              totalRemaining >= 0 ? "bg-chart-1/20 text-chart-1" : "bg-destructive/20 text-destructive"
            )}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={cn(
                "text-xl font-bold",
                totalRemaining >= 0 ? "text-chart-1" : "text-destructive"
              )}>
                ${Math.abs(totalRemaining).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const percentage = Math.min((budget.spent / budget.budget) * 100, 100)
          const isOverBudget = budget.spent > budget.budget
          const isNearLimit = percentage >= 90 && !isOverBudget
          const colors = colorMap[budget.color]

          return (
            <div
              key={budget.id}
              className={cn(
                "group rounded-xl border bg-card p-5 transition-all hover:shadow-lg",
                isOverBudget
                  ? "border-destructive/50 hover:border-destructive"
                  : isNearLimit
                  ? "border-chart-3/50 hover:border-chart-3"
                  : "border-border/50 hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105", colors.bg)}>
                    <budget.icon className={cn("h-6 w-6", colors.text)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{budget.category}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${budget.spent.toLocaleString()} of ${budget.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                {isOverBudget && (
                  <div className="flex items-center gap-1 rounded-full bg-destructive/20 px-2 py-1 text-xs font-medium text-destructive animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    Over budget
                  </div>
                )}
                {isNearLimit && (
                  <div className="flex items-center gap-1 rounded-full bg-chart-3/20 px-2 py-1 text-xs font-medium text-chart-3">
                    <AlertTriangle className="h-3 w-3" />
                    Near limit
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOverBudget ? "bg-destructive" : colors.progress
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "font-medium",
                    isOverBudget ? "text-destructive" : colors.text
                  )}>
                    {percentage.toFixed(0)}% used
                  </span>
                  <span className="text-muted-foreground">
                    ${(budget.budget - budget.spent).toLocaleString()} left
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Card */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
        <h3 className="font-semibold text-foreground mb-2">Budget Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Your Shopping budget is over limit. Consider reducing non-essential purchases.
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Food & Dining is at 90% - you have $80 left for the month.
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Great job keeping Entertainment under 50%!
          </li>
        </ul>
      </div>
    </div>
  )
}
