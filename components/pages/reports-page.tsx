"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, ChevronDown, Download, FileText, Mail, Printer, TrendingDown, TrendingUp } from "lucide-react"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { buildMonthlyReport, formatMonthLabel, getReportMonths, type TransactionRecord } from "@/lib/finance"
import { cn } from "@/lib/utils"

function createReportText(
  monthKey: string,
  transactions: TransactionRecord[],
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string
) {
  const report = buildMonthlyReport(transactions, monthKey)
  const label = formatMonthLabel(`${monthKey}-01`)

  return [
    `Wealth Track Report - ${label}`,
    "",
    `Total Income: ${formatCurrency(report.totalIncome)}`,
    `Total Expenses: ${formatCurrency(report.totalExpenses)}`,
    `Net Savings: ${formatCurrency(report.netSavings)}`,
    `Savings Rate: ${report.savingsRate.toFixed(1)}%`,
    `Transactions: ${report.transactions}`,
    `Average Daily Spending: ${formatCurrency(report.averageDaily)}`,
    "",
    "Top Expense Categories:",
    ...report.topCategories.map((category, index) => `${index + 1}. ${category.name}: ${formatCurrency(category.value)}`),
  ].join("\n")
}

export function ReportsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [selectedMonth, setSelectedMonth] = useState("")
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
        console.error("Error loading reports:", error)
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

  const months = useMemo(() => getReportMonths(transactions), [transactions])

  useEffect(() => {
    if (!selectedMonth && months.length > 0) {
      setSelectedMonth(months[0])
    }
  }, [months, selectedMonth])

  const report = selectedMonth ? buildMonthlyReport(transactions, selectedMonth) : null
  const selectedMonthLabel = selectedMonth ? formatMonthLabel(`${selectedMonth}-01`) : "Select month"

  function downloadReport(monthKey: string) {
    const content = createReportText(monthKey, transactions, formatCurrency)
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `wealth-track-report-${monthKey}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  function printReport() {
    if (!selectedMonth) return

    const popup = window.open("", "_blank", "width=900,height=700")
    if (!popup) return

    popup.document.write("<html><head><title>Wealth Track Report</title><style>body{font-family:Arial,sans-serif;padding:32px;line-height:1.6}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre id='report'></pre></body></html>")
    popup.document.close()
    const target = popup.document.getElementById("report")
    if (target) {
      target.textContent = createReportText(selectedMonth, transactions, formatCurrency)
    }
    popup.focus()
    popup.print()
  }

  function emailReport() {
    if (!selectedMonth) return
    const subject = encodeURIComponent(`Wealth Track Report - ${selectedMonthLabel}`)
    const body = encodeURIComponent(createReportText(selectedMonth, transactions, formatCurrency))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary/50" />
        <div className="h-[420px] animate-pulse rounded-xl bg-secondary/50" />
      </div>
    )
  }

  if (transactions.length === 0 || !report) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Download and view your financial reports</p>
        </div>
        <div className="rounded-xl border border-dashed border-border/60 bg-card p-10 text-center">
          <h3 className="text-lg font-semibold text-foreground">No reports yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add transactions over time and monthly reports will be generated from your actual income and expenses.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Download and view your financial reports</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              {selectedMonthLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {months.map((month) => (
              <DropdownMenuItem key={month} onClick={() => setSelectedMonth(month)} className={cn(selectedMonth === month && "bg-primary/10 text-primary")}>
                {formatMonthLabel(`${month}-01`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
        <div className="border-b border-border/50 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Monthly Financial Report</h2>
                <p className="text-sm text-muted-foreground">{selectedMonthLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={printReport}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={emailReport}>
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button size="sm" className="gap-2" onClick={() => downloadReport(selectedMonth)}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Financial Summary</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                  <span className="text-sm text-muted-foreground">Total Income</span>
                </div>
                <p className="text-2xl font-bold text-chart-1">{formatCurrency(report.totalIncome)}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-chart-4" />
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                </div>
                <p className="text-2xl font-bold text-chart-4">{formatCurrency(report.totalExpenses)}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Net Savings</span>
                </div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(report.netSavings)}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Savings Rate</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{report.savingsRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Top Expense Categories</h3>
            {report.topCategories.length === 0 ? (
              <div className="rounded-lg bg-secondary/30 p-4 text-sm text-muted-foreground">No expense categories recorded for this month.</div>
            ) : (
              <div className="space-y-3">
                {report.topCategories.map((category, index) => {
                  const percentage = report.totalExpenses > 0 ? (category.value / report.totalExpenses) * 100 : 0
                  return (
                    <div key={category.name} className="flex items-center gap-4">
                      <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                          <span className="text-sm text-muted-foreground">{formatCurrency(category.value)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <span className="w-12 text-right text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-border/50 pt-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
              <span className="text-sm text-muted-foreground">Total Transactions</span>
              <span className="font-semibold text-foreground">{report.transactions}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
              <span className="text-sm text-muted-foreground">Average Daily Spending</span>
              <span className="font-semibold text-foreground">{formatCurrency(report.averageDaily)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 bg-secondary/30 px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} from your saved finance data.</p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Past Reports</h3>
        <div className="space-y-3">
          {months.map((month) => (
            <div key={month} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/30">
              <button className="flex items-center gap-4 text-left" onClick={() => setSelectedMonth(month)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{formatMonthLabel(`${month}-01`)}</p>
                  <p className="text-sm text-muted-foreground">Monthly Report</p>
                </div>
              </button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => downloadReport(month)}>
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
