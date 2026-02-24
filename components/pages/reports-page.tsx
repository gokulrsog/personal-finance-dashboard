"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Printer,
  Mail,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const months = [
  "January 2024",
  "December 2023",
  "November 2023",
  "October 2023",
  "September 2023",
]

const reportData = {
  totalIncome: 12450,
  totalExpenses: 8230,
  netSavings: 4220,
  savingsRate: 33.9,
  topCategories: [
    { name: "Housing", amount: 2800 },
    { name: "Shopping", amount: 1520 },
    { name: "Food & Dining", amount: 1200 },
    { name: "Transport", amount: 800 },
    { name: "Entertainment", amount: 610 },
  ],
  transactions: 47,
  averageDaily: 265.48,
}

export function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(months[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Download and view your financial reports</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              {selectedMonth}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {months.map((month) => (
              <DropdownMenuItem
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={cn(selectedMonth === month && "bg-primary/10 text-primary")}
              >
                {month}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Report Preview */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        {/* Report Header */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Monthly Financial Report</h2>
                <p className="text-sm text-muted-foreground">{selectedMonth}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 space-y-6">
          {/* Summary Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Financial Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                  <span className="text-sm text-muted-foreground">Total Income</span>
                </div>
                <p className="text-2xl font-bold text-chart-1">${reportData.totalIncome.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-chart-4" />
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                </div>
                <p className="text-2xl font-bold text-chart-4">${reportData.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Net Savings</span>
                </div>
                <p className="text-2xl font-bold text-primary">${reportData.netSavings.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Savings Rate</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{reportData.savingsRate}%</p>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Expense Categories</h3>
            <div className="space-y-3">
              {reportData.topCategories.map((category, index) => {
                const percentage = (category.amount / reportData.totalExpenses) * 100
                return (
                  <div key={category.name} className="flex items-center gap-4">
                    <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{category.name}</span>
                        <span className="text-sm text-muted-foreground">${category.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-sm text-muted-foreground text-right">{percentage.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <span className="text-sm text-muted-foreground">Total Transactions</span>
              <span className="font-semibold text-foreground">{reportData.transactions}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <span className="text-sm text-muted-foreground">Average Daily Spending</span>
              <span className="font-semibold text-foreground">${reportData.averageDaily.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="px-6 py-4 bg-secondary/30 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} - FinTrack Financial Reports
          </p>
        </div>
      </div>

      {/* Past Reports */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Past Reports</h3>
        <div className="space-y-3">
          {months.slice(1).map((month) => (
            <div
              key={month}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{month}</p>
                  <p className="text-sm text-muted-foreground">Monthly Report</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
