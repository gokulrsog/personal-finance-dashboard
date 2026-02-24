"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const monthlyData = [
  { month: "Jul", income: 4800, expense: 3200 },
  { month: "Aug", income: 5200, expense: 3800 },
  { month: "Sep", income: 4900, expense: 3500 },
  { month: "Oct", income: 5500, expense: 4100 },
  { month: "Nov", income: 5800, expense: 3900 },
  { month: "Dec", income: 6200, expense: 4500 },
]

const weeklyData = [
  { day: "Mon", income: 800, expense: 450 },
  { day: "Tue", income: 650, expense: 380 },
  { day: "Wed", income: 900, expense: 520 },
  { day: "Thu", income: 750, expense: 410 },
  { day: "Fri", income: 1100, expense: 680 },
  { day: "Sat", income: 450, expense: 890 },
  { day: "Sun", income: 300, expense: 420 },
]

const yearlyData = [
  { month: "Jan", income: 52000, expense: 38000 },
  { month: "Feb", income: 48000, expense: 35000 },
  { month: "Mar", income: 55000, expense: 42000 },
  { month: "Apr", income: 51000, expense: 39000 },
  { month: "May", income: 58000, expense: 44000 },
  { month: "Jun", income: 62000, expense: 46000 },
]

const categoryData = [
  { name: "Housing", value: 2800, color: "#4ade80" },
  { name: "Food", value: 1200, color: "#38bdf8" },
  { name: "Transport", value: 800, color: "#fbbf24" },
  { name: "Shopping", value: 1500, color: "#f87171" },
  { name: "Entertainment", value: 600, color: "#a78bfa" },
  { name: "Utilities", value: 450, color: "#94a3b8" },
]

const trendData = [
  { month: "Jun", savings: 1600 },
  { month: "Jul", savings: 1600 },
  { month: "Aug", savings: 1400 },
  { month: "Sep", savings: 1400 },
  { month: "Oct", savings: 1400 },
  { month: "Nov", savings: 1900 },
  { month: "Dec", savings: 1700 },
]

const timeRanges = ["Weekly", "Monthly", "Yearly"]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="font-medium text-foreground">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Monthly")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getData = () => {
    switch (timeRange) {
      case "Weekly":
        return weeklyData
      case "Yearly":
        return yearlyData
      default:
        return monthlyData
    }
  }

  const chartData = getData()
  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0)
  const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0)
  const netSavings = totalIncome - totalExpense
  const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1)

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary/50" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary/50" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-secondary/50" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your financial performance</p>
        </div>
        <div className="flex gap-2 bg-secondary/50 p-1 rounded-lg">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn(
                "transition-all",
                timeRange === range && "shadow-[0_0_10px_rgba(74,222,128,0.2)]"
              )}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <div className="flex items-center gap-1 text-chart-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              +8.2%
            </div>
          </div>
          <p className="text-2xl font-bold text-chart-1 mt-2">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <div className="flex items-center gap-1 text-chart-4 text-xs">
              <TrendingDown className="h-3 w-3" />
              -3.1%
            </div>
          </div>
          <p className="text-2xl font-bold text-chart-4 mt-2">${totalExpense.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <span className="text-xs text-primary font-medium">{savingsRate}% rate</span>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">${netSavings.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Chart - Income vs Expenses */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Income vs Expenses</h3>
            <p className="text-sm text-muted-foreground">{timeRange} comparison</p>
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
              <XAxis
                dataKey={timeRange === "Weekly" ? "day" : "month"}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Expense Categories</h3>
          <div className="flex items-center gap-6">
            <div className="h-[200px] w-[200px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                            <p className="text-sm font-medium text-foreground">{data.name}</p>
                            <p className="text-lg font-bold text-foreground">${data.value.toLocaleString()}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {categoryData.map((item) => {
                const percentage = ((item.value / categoryData.reduce((s, i) => s + i.value, 0)) * 100).toFixed(0)
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">${item.value}</span>
                      <span className="text-xs text-muted-foreground w-8 text-right">{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Savings Trend */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Savings Trend</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                  width={50}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-lg font-bold text-primary">${payload[0].value?.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#4ade80"
                  strokeWidth={3}
                  dot={{ fill: "#4ade80", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#4ade80" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average monthly savings</span>
            <span className="font-semibold text-primary">
              ${(trendData.reduce((s, d) => s + d.savings, 0) / trendData.length).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
