"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Gamepad2,
  Heart,
  Home,
  Loader2,
  Plus,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { computeBudgetSpent, formatMonthLabel, getMonthKey, type BudgetRecord, type TransactionRecord } from "@/lib/finance"
import { cn } from "@/lib/utils"

const budgetCategories = [
  { label: "Shopping", icon: ShoppingBag, color: "chart-4" },
  { label: "Housing", icon: Home, color: "primary" },
  { label: "Transport", icon: Car, color: "chart-3" },
  { label: "Food", icon: Utensils, color: "chart-2" },
  { label: "Entertainment", icon: Gamepad2, color: "chart-5" },
  { label: "Health", icon: Heart, color: "destructive" },
  { label: "Utilities", icon: Zap, color: "muted-foreground" },
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

function currentMonthValue() {
  return new Date().toISOString().slice(0, 7)
}

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetRecord[]>([])
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue())
  const [createOpen, setCreateOpen] = useState(false)
  const [category, setCategory] = useState(budgetCategories[0].label)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { addNotification, formatCurrency } = useAppPreferences()

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setLoading(true)

      try {
        const [budgetsResponse, transactionsResponse] = await Promise.all([
          fetch("/api/budgets", { cache: "no-store" }),
          fetch("/api/transactions", { cache: "no-store" }),
        ])

        const [budgetsPayload, transactionsPayload] = await Promise.all([
          budgetsResponse.json(),
          transactionsResponse.json(),
        ])

        if (!isMounted) return
        setBudgets(Array.isArray(budgetsPayload) ? budgetsPayload : [])
        setTransactions(Array.isArray(transactionsPayload) ? transactionsPayload : [])
      } catch (error) {
        console.error("Error loading budgets:", error)
        if (!isMounted) return
        setBudgets([])
        setTransactions([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleBudgets = budgets
    .filter((budget) => getMonthKey(budget.month) === selectedMonth)
    .map((budget) => {
      const meta = budgetCategories.find((item) => item.label === budget.category) ?? budgetCategories[0]
      const spent = computeBudgetSpent(budget, transactions)
      return {
        ...budget,
        spent,
        meta,
      }
    })

  const totalBudget = visibleBudgets.reduce((sum, budget) => sum + budget.budget, 0)
  const totalSpent = visibleBudgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const overBudget = visibleBudgets.filter((budget) => budget.spent > budget.budget)
  const nearLimit = visibleBudgets.filter((budget) => {
    const percentage = budget.budget > 0 ? (budget.spent / budget.budget) * 100 : 0
    return percentage >= 85 && budget.spent <= budget.budget
  })

  async function handleCreateBudget(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          budget: amount,
          month: `${selectedMonth}-01`,
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to create budget")
      }

      setBudgets((previous) => [payload, ...previous])
      addNotification({
        title: "Budget created",
        description: `${category} now has a monthly limit of ${formatCurrency(Number(amount))}.`,
        kind: "success",
      })
      setAmount("")
      setCategory(budgetCategories[0].label)
      setCreateOpen(false)
    } catch (error) {
      console.error(error)
      addNotification({
        title: "Budget failed",
        description: "The budget could not be created. Please try again.",
        kind: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteBudget(id: string, budgetName: string) {
    const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" })
    if (!response.ok) {
      addNotification({
        title: "Delete failed",
        description: "The budget could not be deleted. Please try again.",
        kind: "error",
      })
      return
    }
    setBudgets((previous) => previous.filter((budget) => budget.id !== id))
    addNotification({
      title: "Budget removed",
      description: `${budgetName} has been removed from your monthly plan.`,
      kind: "warning",
    })
  }

  useEffect(() => {
    overBudget.forEach((budget) => {
      addNotification({
        title: "Budget exceeded",
        description: `${budget.category} is over budget by ${formatCurrency(budget.spent - budget.budget)} for ${formatMonthLabel(`${selectedMonth}-01`)}.`,
        kind: "warning",
        dedupeKey: `budget-page-over-${selectedMonth}-${budget.id}`,
        silent: true,
      })
    })

    nearLimit.forEach((budget) => {
      addNotification({
        title: "Budget nearing limit",
        description: `${budget.category} has ${formatCurrency(Math.max(budget.budget - budget.spent, 0))} left for ${formatMonthLabel(`${selectedMonth}-01`)}.`,
        kind: "info",
        dedupeKey: `budget-page-near-${selectedMonth}-${budget.id}`,
        silent: true,
      })
    })
  }, [addNotification, formatCurrency, nearLimit, overBudget, selectedMonth])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <p className="text-sm text-muted-foreground">{formatMonthLabel(`${selectedMonth}-01`)}</p>
        </div>

        <div className="flex gap-3">
          <Input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="w-[170px] bg-secondary/30" />
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
                <DialogDescription>Set a category budget for the selected month.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBudget} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-category">Category</Label>
                  <select
                    id="budget-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {budgetCategories.map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-amount">Monthly limit</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </span>
                    ) : (
                      "Save budget"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20 text-chart-4">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", totalRemaining >= 0 ? "bg-chart-1/20 text-chart-1" : "bg-destructive/20 text-destructive")}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={cn("text-xl font-bold", totalRemaining >= 0 ? "text-chart-1" : "text-destructive")}>
                {formatCurrency(Math.abs(totalRemaining))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl bg-secondary/40" />
          ))}
        </div>
      ) : visibleBudgets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-card p-10 text-center">
          <h3 className="text-lg font-semibold text-foreground">No budgets for this month</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create a monthly category limit to start tracking how close you are to plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleBudgets.map((budget) => {
            const percentage = budget.budget > 0 ? Math.min((budget.spent / budget.budget) * 100, 100) : 0
            const isOverBudget = budget.spent > budget.budget
            const isNearLimit = percentage >= 85 && !isOverBudget
            const colors = colorMap[budget.meta.color]

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
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105", colors.bg)}>
                      <budget.meta.icon className={cn("h-6 w-6", colors.text)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{budget.category}</h3>
                      <p className="text-sm text-muted-foreground">{formatCurrency(budget.spent)} of {formatCurrency(budget.budget)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOverBudget ? (
                      <div className="flex items-center gap-1 rounded-full bg-destructive/20 px-2 py-1 text-xs font-medium text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        Over budget
                      </div>
                    ) : null}
                    <button onClick={() => handleDeleteBudget(budget.id, budget.category)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", isOverBudget ? "bg-destructive" : colors.progress)}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn("font-medium", isOverBudget ? "text-destructive" : colors.text)}>{percentage.toFixed(0)}% used</span>
                    <span className="text-muted-foreground">{formatCurrency(Math.max(budget.budget - budget.spent, 0))} left</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
        <h3 className="mb-2 font-semibold text-foreground">Budget Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {visibleBudgets.length === 0 ? (
            <li>Create one budget category first so the app can compare planned vs actual spending.</li>
          ) : overBudget.length > 0 ? (
            overBudget.map((budget) => (
              <li key={budget.id}>Your {budget.category} budget is over limit. Review recent spending in that category and tighten it for next month.</li>
            ))
          ) : nearLimit.length > 0 ? (
            nearLimit.map((budget) => (
              <li key={budget.id}>{budget.category} is close to its monthly limit. You still have {formatCurrency(Math.max(budget.budget - budget.spent, 0))} left.</li>
            ))
          ) : (
            <li>Your budgets are currently on track. Keep reviewing categories as you add more transactions.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
