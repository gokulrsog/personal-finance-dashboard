"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Gamepad2,
  Briefcase,
  CreditCard,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  FileText,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import {
  allTransactionCategories,
  expenseCategories,
  findPaymentLabel,
  findTransactionCategoryLabel,
  incomeCategories,
  paymentModes,
} from "@/lib/transaction-options"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ElementType> = {
  Shopping: ShoppingBag,
  Housing: Home,
  Transport: Car,
  Food: Utensils,
  Entertainment: Gamepad2,
  Salary: Briefcase,
  Freelance: Briefcase,
  Business: Briefcase,
  Gift: Briefcase,
  Bills: CreditCard,
  Health: CreditCard,
  Utilities: CreditCard,
}

const categoryColors: Record<string, string> = {
  Shopping: "bg-chart-4/20 text-chart-4",
  Housing: "bg-primary/20 text-primary",
  Transport: "bg-chart-3/20 text-chart-3",
  Food: "bg-chart-2/20 text-chart-2",
  Entertainment: "bg-chart-5/20 text-chart-5",
  Salary: "bg-chart-1/20 text-chart-1",
  Freelance: "bg-chart-1/20 text-chart-1",
  Business: "bg-chart-1/20 text-chart-1",
  Gift: "bg-chart-1/20 text-chart-1",
  Bills: "bg-muted text-muted-foreground",
  Health: "bg-destructive/20 text-destructive",
  Utilities: "bg-muted text-muted-foreground",
}

const filters = ["All", "Income", "Expense"]
const categories = ["All Categories", ...Array.from(new Set(allTransactionCategories.map((category) => category.label)))]

interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  type: string
  date: string
  paymentMode?: string
  notes?: string | null
}

type TransactionFormState = {
  description: string
  amount: string
  category: string
  type: "income" | "expense"
  date: string
  paymentMode: string
  notes: string
}

const defaultFormState: TransactionFormState = {
  description: "",
  amount: "",
  category: "",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
  paymentMode: "",
  notes: "",
}

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formState, setFormState] = useState<TransactionFormState>(defaultFormState)
  const [saving, setSaving] = useState(false)
  const { addNotification, formatCurrency, selectedCurrency } = useAppPreferences()

  const currencySymbol =
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selectedCurrency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")
      ?.value ?? selectedCurrency

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/transactions")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(data || [])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "All" || 
      (activeFilter === "Income" && t.type === "income") ||
      (activeFilter === "Expense" && t.type === "expense")
    const matchesCategory = selectedCategory === "All Categories" || t.category === selectedCategory
    return matchesSearch && matchesFilter && matchesCategory
  })

  const availableCategories = formState.type === "income" ? incomeCategories : expenseCategories

  function openEditDialog(transaction: Transaction) {
    const categoryId = allTransactionCategories.find((category) => category.label === transaction.category)?.id || ""
    const paymentId = paymentModes.find((paymentMode) => paymentMode.label === transaction.paymentMode)?.id || ""

    setEditingTransaction(transaction)
    setFormState({
      description: transaction.description,
      amount: `${transaction.amount}`,
      category: categoryId,
      type: transaction.type === "income" ? "income" : "expense",
      date: transaction.date.split("T")[0],
      paymentMode: paymentId,
      notes: transaction.notes || "",
    })
  }

  function closeEditDialog() {
    setEditingTransaction(null)
    setFormState(defaultFormState)
  }

  async function handleUpdateTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingTransaction) return

    setSaving(true)

    try {
      const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formState.description.trim(),
          amount: Number(formState.amount),
          category: findTransactionCategoryLabel(formState.category),
          type: formState.type,
          date: formState.date,
          paymentMode: findPaymentLabel(formState.paymentMode),
          notes: formState.notes.trim(),
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to update transaction")
      }

      setTransactions((current) => current.map((transaction) => (transaction.id === payload.id ? payload : transaction)))
      addNotification({
        title: "Transaction updated",
        description: `${payload.description} is now saved for ${formatCurrency(payload.amount)}.`,
        kind: "success",
      })
      closeEditDialog()
    } catch (error) {
      console.error("Error updating transaction:", error)
      addNotification({
        title: "Update failed",
        description: "The transaction could not be updated. Please try again.",
        kind: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, description: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete transaction")
      setTransactions((current) => current.filter((transaction) => transaction.id !== id))
      addNotification({
        title: "Transaction deleted",
        description: `${description} was removed from your records.`,
        kind: "warning",
      })
    } catch (error) {
      console.error("Error deleting transaction:", error)
      addNotification({
        title: "Delete failed",
        description: "The transaction could not be deleted. Please try again.",
        kind: "error",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">View and manage all your transactions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "transition-all",
                activeFilter === filter && "shadow-[0_0_15px_rgba(74,222,128,0.2)]"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Category dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              {selectedCategory}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(selectedCategory === category && "bg-primary/10 text-primary")}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Transactions List */}
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Try adjusting your search or filter to find what you are looking for.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredTransactions.map((transaction) => {
              const Icon = categoryIcons[transaction.category] || CreditCard
              const colorClass = categoryColors[transaction.category] || "bg-muted text-muted-foreground"
              
              return (
                <div
                  key={transaction.id}
                  className="group flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  {/* Icon */}
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105", colorClass)}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate">{transaction.description}</h4>
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-chart-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-chart-4 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{transaction.category}</span>
                      <span className="text-xs text-muted-foreground">-</span>
                      <span className="text-xs text-muted-foreground">{transaction.paymentMode || "N/A"}</span>
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="text-right flex-shrink-0">
                    <p className={cn(
                      "font-semibold tabular-nums",
                      transaction.type === "income" ? "text-chart-1" : "text-foreground"
                    )}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onSelect={() => openEditDialog(transaction)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => handleDelete(transaction.id, transaction.description)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold text-chart-1 mt-1">
            +{formatCurrency(filteredTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-chart-4 mt-1">
            -{formatCurrency(filteredTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-sm text-muted-foreground">Net Balance</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(
              filteredTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0) -
              filteredTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
      </div>

      <Dialog open={Boolean(editingTransaction)} onOpenChange={(open) => (!open ? closeEditDialog() : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update the transaction details and save the new values.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTransaction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    {currencySymbol}
                  </span>
                  <Input id="edit-amount" type="number" min="0" step="0.01" value={formState.amount} onChange={(event) => setFormState((current) => ({ ...current, amount: event.target.value }))} className="pl-8" required />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={formState.type === "expense" ? "default" : "outline"} onClick={() => setFormState((current) => ({ ...current, type: "expense", category: "" }))}>
                    Expense
                  </Button>
                  <Button type="button" variant={formState.type === "income" ? "default" : "outline"} onClick={() => setFormState((current) => ({ ...current, type: "income", category: "" }))}>
                    Income
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input id="edit-date" type="date" value={formState.date} onChange={(event) => setFormState((current) => ({ ...current, date: event.target.value }))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {availableCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormState((current) => ({ ...current, category: category.id }))}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-xs transition-all",
                      formState.category === category.id
                        ? category.color
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {paymentModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFormState((current) => ({ ...current, paymentMode: mode.id }))}
                    className={cn(
                      "rounded-lg border-2 p-3 text-sm font-medium transition-all",
                      formState.paymentMode === mode.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </Label>
              <Textarea id="edit-notes" value={formState.notes} onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))} className="min-h-[100px]" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditDialog}>Cancel</Button>
              <Button type="submit" disabled={saving || !formState.description.trim() || !formState.amount || !formState.category || !formState.paymentMode}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
