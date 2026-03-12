export type TransactionRecord = {
  id: string
  amount: number
  description: string
  category: string
  type: string
  date: string
  notes?: string | null
  paymentMode?: string | null
}

export type BudgetRecord = {
  id: string
  category: string
  budget: number
  spent?: number
  month: string
}

export type GoalRecord = {
  id: string
  name: string
  description?: string | null
  targetAmount: number
  currentAmount: number
  dueDate?: string | null
  category?: string | null
}

export type UserProfile = {
  id: string
  name: string
  email: string
  avatar?: string | null
  createdAt: string
}

export type ChartDatum = {
  label: string
  income: number
  expense: number
}

export type PieDatum = {
  name: string
  value: number
  color: string
}

const categoryColorMap: Record<string, string> = {
  housing: "#4ade80",
  income: "#4ade80",
  food: "#38bdf8",
  "food & dining": "#38bdf8",
  transport: "#fbbf24",
  shopping: "#f87171",
  entertainment: "#a78bfa",
  utilities: "#94a3b8",
  health: "#fb7185",
  bills: "#94a3b8",
}

export function sortTransactionsDesc(transactions: TransactionRecord[]) {
  return [...transactions].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
  )
}

export function getInitials(name?: string | null) {
  if (!name) return "U"

  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "U"
}

export function getMonthKey(dateLike: Date | string) {
  const date = new Date(dateLike)
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}`
}

export function formatMonthLabel(dateLike: Date | string) {
  return new Date(dateLike).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export function getMonthStart(dateLike: Date | string) {
  const date = new Date(dateLike)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function computeNetBalance(transactions: TransactionRecord[]) {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.type === "income" ? transaction.amount : -transaction.amount)
  }, 0)
}

export function getCurrentMonthTransactions(transactions: TransactionRecord[]) {
  const monthKey = getMonthKey(new Date())
  return transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey)
}

export function getPreviousMonthTransactions(transactions: TransactionRecord[]) {
  const now = new Date()
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const monthKey = getMonthKey(previous)
  return transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey)
}

export function calculateIncome(transactions: TransactionRecord[]) {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function calculateExpenses(transactions: TransactionRecord[]) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function calculatePercentChange(currentValue: number, previousValue: number) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0
  }

  return ((currentValue - previousValue) / previousValue) * 100
}

export function buildMonthlyBalanceSeries(transactions: TransactionRecord[], months = 6) {
  const monthlyNet = new Map<string, number>()

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date()
    date.setMonth(date.getMonth() - index)
    monthlyNet.set(getMonthKey(date), 0)
  }

  transactions.forEach((transaction) => {
    const key = getMonthKey(transaction.date)
    if (!monthlyNet.has(key)) return

    const delta = transaction.type === "income" ? transaction.amount : -transaction.amount
    monthlyNet.set(key, (monthlyNet.get(key) ?? 0) + delta)
  })

  let runningBalance = 0
  return Array.from(monthlyNet.entries()).map(([key, value]) => {
    runningBalance += value
    return {
      month: formatMonthLabel(`${key}-01`).split(" ")[0],
      balance: Math.max(runningBalance, 0),
    }
  })
}

export function buildSavingsTrend(transactions: TransactionRecord[], months = 6) {
  const monthlyNet = new Map<string, number>()

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date()
    date.setMonth(date.getMonth() - index)
    monthlyNet.set(getMonthKey(date), 0)
  }

  transactions.forEach((transaction) => {
    const key = getMonthKey(transaction.date)
    if (!monthlyNet.has(key)) return

    const delta = transaction.type === "income" ? transaction.amount : -transaction.amount
    monthlyNet.set(key, (monthlyNet.get(key) ?? 0) + delta)
  })

  return Array.from(monthlyNet.entries()).map(([key, value]) => ({
    month: formatMonthLabel(`${key}-01`).split(" ")[0],
    savings: value,
  }))
}

export function buildExpenseBreakdown(transactions: TransactionRecord[], monthKey = getMonthKey(new Date())) {
  const categoryTotals = new Map<string, number>()

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return
    if (getMonthKey(transaction.date) !== monthKey) return

    categoryTotals.set(
      transaction.category,
      (categoryTotals.get(transaction.category) ?? 0) + transaction.amount
    )
  })

  return Array.from(categoryTotals.entries())
    .map(([name, value]) => ({
      name,
      value,
      color: categoryColorMap[name.toLowerCase()] ?? "#94a3b8",
    }))
    .sort((left, right) => right.value - left.value)
}

export function buildIncomeExpenseSeries(
  transactions: TransactionRecord[],
  timeRange: "Weekly" | "Monthly" | "Yearly"
): ChartDatum[] {
  if (timeRange === "Weekly") {
    const points = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      return {
        date,
        key: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
      }
    })

    return points.map((point) => {
      const dayTransactions = transactions.filter(
        (transaction) => transaction.date.split("T")[0] === point.key
      )

      return {
        label: point.label,
        income: calculateIncome(dayTransactions),
        expense: calculateExpenses(dayTransactions),
      }
    })
  }

  const periods = Array.from({ length: timeRange === "Monthly" ? 6 : 12 }, (_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - ((timeRange === "Monthly" ? 5 : 11) - index))
    const key = getMonthKey(date)

    return {
      key,
      label: date.toLocaleDateString("en-US", { month: "short" }),
    }
  })

  return periods.map((period) => {
    const periodTransactions = transactions.filter(
      (transaction) => getMonthKey(transaction.date) === period.key
    )

    return {
      label: period.label,
      income: calculateIncome(periodTransactions),
      expense: calculateExpenses(periodTransactions),
    }
  })
}

export function computeBudgetSpent(budget: BudgetRecord, transactions: TransactionRecord[]) {
  return transactions
    .filter((transaction) => {
      return (
        transaction.type === "expense" &&
        transaction.category.toLowerCase() === budget.category.toLowerCase() &&
        getMonthKey(transaction.date) === getMonthKey(budget.month)
      )
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function getRecentTransactions(transactions: TransactionRecord[], limit = 6) {
  return sortTransactionsDesc(transactions).slice(0, limit)
}

export function getReportMonths(transactions: TransactionRecord[]) {
  const uniqueMonths = Array.from(new Set(transactions.map((transaction) => getMonthKey(transaction.date))))
  return uniqueMonths.sort((left, right) => (left < right ? 1 : -1))
}

export function buildMonthlyReport(transactions: TransactionRecord[], monthKey: string) {
  const monthTransactions = transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey)
  const totalIncome = calculateIncome(monthTransactions)
  const totalExpenses = calculateExpenses(monthTransactions)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0
  const topCategories = buildExpenseBreakdown(monthTransactions, monthKey).slice(0, 5)

  const monthDate = new Date(`${monthKey}-01`)
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    topCategories,
    transactions: monthTransactions.length,
    averageDaily: daysInMonth > 0 ? totalExpenses / daysInMonth : 0,
    monthTransactions,
  }
}
