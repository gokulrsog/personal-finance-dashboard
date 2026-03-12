"use client"

import { useEffect, useState } from "react"
import { ArrowDownRight, ArrowUpRight, PlusCircle, TrendingUp } from "lucide-react"
import { AIChatWidget } from "@/components/dashboard/ai-chat-widget"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { Button } from "@/components/ui/button"
import type { PageType } from "@/components/main-app"
import {
  buildExpenseBreakdown,
  buildMonthlyBalanceSeries,
  calculateExpenses,
  calculateIncome,
  calculatePercentChange,
  computeBudgetSpent,
  computeNetBalance,
  getCurrentMonthTransactions,
  getMonthKey,
  getPreviousMonthTransactions,
  getRecentTransactions,
  type BudgetRecord,
  type GoalRecord,
  type TransactionRecord,
} from "@/lib/finance"

interface DashboardPageProps {
  onNavigate: (page: PageType) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [budgets, setBudgets] = useState<BudgetRecord[]>([])
  const [goals, setGoals] = useState<GoalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { addNotification, formatCurrency } = useAppPreferences()

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setLoading(true)

      try {
        const [transactionsResponse, budgetsResponse, goalsResponse] = await Promise.all([
          fetch("/api/transactions", { cache: "no-store" }),
          fetch("/api/budgets", { cache: "no-store" }),
          fetch("/api/goals", { cache: "no-store" }),
        ])

        const [transactionsPayload, budgetsPayload, goalsPayload] = await Promise.all([
          transactionsResponse.json(),
          budgetsResponse.json(),
          goalsResponse.json(),
        ])

        if (!isMounted) return

        setTransactions(Array.isArray(transactionsPayload) ? transactionsPayload : [])
        setBudgets(Array.isArray(budgetsPayload) ? budgetsPayload : [])
        setGoals(Array.isArray(goalsPayload) ? goalsPayload : [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)

        if (!isMounted) return

        setTransactions([])
        setBudgets([])
        setGoals([])
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

  const currentMonthTransactions = getCurrentMonthTransactions(transactions)
  const previousMonthTransactions = getPreviousMonthTransactions(transactions)
  const totalBalance = computeNetBalance(transactions)
  const currentMonthIncome = calculateIncome(currentMonthTransactions)
  const currentMonthExpenses = calculateExpenses(currentMonthTransactions)
  const currentMonthNet = currentMonthIncome - currentMonthExpenses
  const previousMonthNet = computeNetBalance(previousMonthTransactions)
  const monthChange = calculatePercentChange(currentMonthNet, previousMonthNet)
  const balanceSeries = buildMonthlyBalanceSeries(transactions)
  const expenseBreakdown = buildExpenseBreakdown(transactions)
  const recentTransactions = getRecentTransactions(transactions)
  const hasAnyData = transactions.length > 0 || budgets.length > 0 || goals.length > 0
  const currentMonthKey = getMonthKey(new Date().toISOString())
  const currentMonthBudgets = budgets.filter((budget) => getMonthKey(budget.month) === currentMonthKey)

  useEffect(() => {
    currentMonthBudgets.forEach((budget) => {
      const spent = computeBudgetSpent(budget, transactions)

      if (budget.budget > 0 && spent > budget.budget) {
        addNotification({
          title: "Budget exceeded",
          description: `${budget.category} is over budget by ${formatCurrency(spent - budget.budget)} this month.`,
          kind: "warning",
          dedupeKey: `budget-over-${currentMonthKey}-${budget.id}`,
          silent: true,
        })
        return
      }

      if (budget.budget > 0 && spent / budget.budget >= 0.85) {
        addNotification({
          title: "Budget almost full",
          description: `${budget.category} has ${formatCurrency(Math.max(budget.budget - spent, 0))} left this month.`,
          kind: "info",
          dedupeKey: `budget-near-${currentMonthKey}-${budget.id}`,
          silent: true,
        })
      }
    })
  }, [addNotification, currentMonthBudgets, currentMonthKey, formatCurrency, transactions])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-2xl bg-secondary/40" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-secondary/40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />

          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                  {formatCurrency(totalBalance)}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-chart-1/20 px-2 py-0.5 text-xs font-medium text-chart-1">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {monthChange >= 0 ? "+" : ""}
                    {monthChange.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
                {!hasAnyData ? (
                  <p className="mt-3 text-sm text-muted-foreground">Start by adding your first transaction to build your dashboard.</p>
                ) : null}
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-1/20 text-chart-1">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Income</p>
                    <p className="text-sm font-semibold text-foreground">+{formatCurrency(currentMonthIncome)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-4/20 text-chart-4">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                    <p className="text-sm font-semibold text-foreground">-{formatCurrency(currentMonthExpenses)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <BalanceChart data={balanceSeries} />
            </div>
          </div>
        </div>

        <QuickStats transactions={transactions} budgets={budgets} goals={goals} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Expense Breakdown</h3>
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <ExpenseChart data={expenseBreakdown} />
          </div>

          <div className="flex flex-col rounded-xl border border-border/50 bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
            <div className="flex flex-1 flex-col justify-center gap-3">
              <Button
                onClick={() => onNavigate("add")}
                className="h-12 w-full justify-start gap-3 border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                variant="outline"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Transaction
              </Button>
              <Button onClick={() => onNavigate("budgets")} variant="outline" className="h-12 w-full justify-start gap-3">
                <TrendingUp className="h-5 w-5" />
                Set Budget Goal
              </Button>
              <Button onClick={() => onNavigate("analytics")} variant="outline" className="h-12 w-full justify-start gap-3">
                <ArrowUpRight className="h-5 w-5" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        <TransactionsList transactions={recentTransactions} onViewAll={() => onNavigate("transactions")} onAdd={() => onNavigate("add")} />
      </div>

      <div className="xl:col-span-1">
        <div className="sticky top-24 h-[calc(100vh-8rem)]">
          <AIChatWidget />
        </div>
      </div>
    </div>
  )
}
