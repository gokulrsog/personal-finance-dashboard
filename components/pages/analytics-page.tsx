"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  buildIncomeExpenseSeries,
  buildSavingsTrend,
  calculateExpenses,
  calculateIncome,
  type PieDatum,
  type TransactionRecord,
} from "@/lib/finance"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { cn } from "@/lib/utils"

const timeRanges = ["Weekly", "Monthly", "Yearly"] as const
type TimeRange = (typeof timeRanges)[number]

const pieColors = ["#4ade80", "#38bdf8", "#fbbf24", "#f87171", "#a78bfa", "#94a3b8"]

function CustomTooltip({
  active,
  payload,
  label,
  formatCurrency,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="capitalize text-muted-foreground">{entry.dataKey}:</span>
            <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function filterTransactionsByRange(transactions: TransactionRecord[], timeRange: TimeRange) {
  const now = new Date()
  let start = new Date(now)

  if (timeRange === "Weekly") {
    start.setDate(now.getDate() - 6)
    start.setHours(0, 0, 0, 0)
  } else if (timeRange === "Monthly") {
    start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  }

  return transactions.filter((transaction) => new Date(transaction.date) >= start)
}

function buildRangeExpenseBreakdown(transactions: TransactionRecord[]): PieDatum[] {
  const totals = new Map<string, number>()

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount)
  })

  return Array.from(totals.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([name, value], index) => ({
      name,
      value,
      color: pieColors[index % pieColors.length],
    }))
}

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Monthly")
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { formatCurrency } = useAppPreferences()

  useEffect(() => {
    let isMounted = true

    async function loadTransactions() {
      setLoading(true)

      try {
        const response = await fetch("/api/transactions", { cache: "no-store" })
        const payload = await response.json()

        if (!isMounted) return
        setTransactions(Array.isArray(payload) ? payload : [])
      } catch (error) {
        console.error("Error loading analytics:", error)
        if (!isMounted) return
        setTransactions([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      isMounted = false
    }
  }, [])

  const rangeTransactions = filterTransactionsByRange(transactions, timeRange)
  const chartData = buildIncomeExpenseSeries(rangeTransactions, timeRange)
  const expenseData = buildRangeExpenseBreakdown(rangeTransactions)
  const trendData = buildSavingsTrend(transactions, 6)
  const totalIncome = calculateIncome(rangeTransactions)
  const totalExpense = calculateExpenses(rangeTransactions)
  const netSavings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0"
  const expenseTotal = expenseData.reduce((sum, item) => sum + item.value, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary/50" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-secondary/50" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-secondary/50" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your financial performance</p>
        </div>
        <div className="rounded-xl border border-dashed border-border/60 bg-card p-10 text-center">
          <h3 className="text-lg font-semibold text-foreground">No analytics yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add transactions first and the charts will reflect your actual income, expenses, and savings trend.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your financial performance</p>
        </div>
        <div className="flex gap-2 rounded-lg bg-secondary/50 p-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn("transition-all", timeRange === range && "shadow-[0_0_10px_rgba(74,222,128,0.2)]")}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <div className="flex items-center gap-1 text-xs text-chart-1">
              <TrendingUp className="h-3 w-3" />
              {rangeTransactions.filter((item) => item.type === "income").length} entries
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-chart-1">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <div className="flex items-center gap-1 text-xs text-chart-4">
              <TrendingDown className="h-3 w-3" />
              {rangeTransactions.filter((item) => item.type === "expense").length} entries
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-chart-4">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <span className="text-xs font-medium text-primary">{savingsRate}% rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">{formatCurrency(netSavings)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Income vs Expenses</h3>
            <p className="text-sm text-muted-foreground">{timeRange} comparison based on your transaction history</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-1" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-4" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(Number(value), { notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 })}
                width={72}
              />
              <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Expense Categories</h3>
          {expenseData.length === 0 ? (
            <div className="flex h-[240px] items-center justify-center rounded-lg bg-secondary/20 text-sm text-muted-foreground">
              No expense data available for this range.
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as PieDatum
                          return (
                            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                              <p className="text-sm font-medium text-foreground">{data.name}</p>
                              <p className="text-lg font-bold text-foreground">{formatCurrency(data.value)}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {expenseData.map((item) => {
                  const percentage = expenseTotal > 0 ? ((item.value / expenseTotal) * 100).toFixed(0) : "0"
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{formatCurrency(item.value)}</span>
                        <span className="w-8 text-right text-xs text-muted-foreground">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Savings Trend</h3>
          {trendData.length === 0 ? (
            <div className="flex h-[240px] items-center justify-center rounded-lg bg-secondary/20 text-sm text-muted-foreground">
              Not enough historical data yet.
            </div>
          ) : (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value), { notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 })} width={72} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                              <p className="text-sm font-medium text-foreground">{label}</p>
                              <p className="text-lg font-bold text-primary">{formatCurrency(Number(payload[0].value ?? 0))}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line type="monotone" dataKey="savings" stroke="#4ade80" strokeWidth={3} dot={{ fill: "#4ade80", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#4ade80" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average monthly savings</span>
                <span className="font-semibold text-primary">{formatCurrency(trendData.reduce((sum, item) => sum + item.savings, 0) / trendData.length)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
