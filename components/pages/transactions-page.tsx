"use client"

import React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ElementType> = {
  Shopping: ShoppingBag,
  Housing: Home,
  Transport: Car,
  Food: Utensils,
  Entertainment: Gamepad2,
  Income: Briefcase,
  Bills: CreditCard,
}

const categoryColors: Record<string, string> = {
  Shopping: "bg-chart-4/20 text-chart-4",
  Housing: "bg-primary/20 text-primary",
  Transport: "bg-chart-3/20 text-chart-3",
  Food: "bg-chart-2/20 text-chart-2",
  Entertainment: "bg-chart-5/20 text-chart-5",
  Income: "bg-chart-1/20 text-chart-1",
  Bills: "bg-muted text-muted-foreground",
}

const transactions = [
  { id: 1, description: "Salary Deposit", category: "Income", amount: 5200, type: "income", date: "2024-01-15", paymentMode: "Bank Transfer" },
  { id: 2, description: "Rent Payment", category: "Housing", amount: 1500, type: "expense", date: "2024-01-14", paymentMode: "Bank Transfer" },
  { id: 3, description: "Grocery Store", category: "Food", amount: 156.80, type: "expense", date: "2024-01-14", paymentMode: "Credit Card" },
  { id: 4, description: "Netflix Subscription", category: "Entertainment", amount: 15.99, type: "expense", date: "2024-01-13", paymentMode: "Credit Card" },
  { id: 5, description: "Gas Station", category: "Transport", amount: 65.00, type: "expense", date: "2024-01-13", paymentMode: "Debit Card" },
  { id: 6, description: "Amazon Purchase", category: "Shopping", amount: 89.99, type: "expense", date: "2024-01-12", paymentMode: "Credit Card" },
  { id: 7, description: "Freelance Work", category: "Income", amount: 800, type: "income", date: "2024-01-12", paymentMode: "PayPal" },
  { id: 8, description: "Restaurant Dinner", category: "Food", amount: 78.50, type: "expense", date: "2024-01-11", paymentMode: "Credit Card" },
  { id: 9, description: "Electricity Bill", category: "Bills", amount: 125.00, type: "expense", date: "2024-01-10", paymentMode: "Bank Transfer" },
  { id: 10, description: "Uber Ride", category: "Transport", amount: 24.50, type: "expense", date: "2024-01-10", paymentMode: "Credit Card" },
  { id: 11, description: "Spotify Premium", category: "Entertainment", amount: 9.99, type: "expense", date: "2024-01-09", paymentMode: "Credit Card" },
  { id: 12, description: "Coffee Shop", category: "Food", amount: 12.50, type: "expense", date: "2024-01-09", paymentMode: "Debit Card" },
]

const filters = ["All", "Income", "Expense"]
const categories = ["All Categories", "Shopping", "Housing", "Transport", "Food", "Entertainment", "Income", "Bills"]

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "All" || 
      (activeFilter === "Income" && t.type === "income") ||
      (activeFilter === "Expense" && t.type === "expense")
    const matchesCategory = selectedCategory === "All Categories" || t.category === selectedCategory
    return matchesSearch && matchesFilter && matchesCategory
  })

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
        {filteredTransactions.length === 0 ? (
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
                      <span className="text-xs text-muted-foreground">{transaction.paymentMode}</span>
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="text-right flex-shrink-0">
                    <p className={cn(
                      "font-semibold tabular-nums",
                      transaction.type === "income" ? "text-chart-1" : "text-foreground"
                    )}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                      <DropdownMenuItem className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
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
            +${filteredTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-chart-4 mt-1">
            -${filteredTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-sm text-muted-foreground">Net Balance</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ${(
              filteredTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0) -
              filteredTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  )
}
