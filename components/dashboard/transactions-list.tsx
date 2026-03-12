"use client"

import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Car,
  Coffee,
  CreditCard,
  Music,
  ShoppingBag,
  Home,
  Heart,
  Utensils,
  Zap,
} from "lucide-react"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { type TransactionRecord } from "@/lib/finance"
import { cn } from "@/lib/utils"

interface TransactionsListProps {
  transactions: TransactionRecord[]
  onViewAll?: () => void
  onAdd?: () => void
}

const categoryIcons: Record<string, typeof CreditCard> = {
  shopping: ShoppingBag,
  food: Utensils,
  coffee: Coffee,
  utilities: Zap,
  transport: Car,
  entertainment: Music,
  housing: Home,
  health: Heart,
  salary: Briefcase,
  freelance: Briefcase,
  business: Briefcase,
  gift: Briefcase,
}

function formatTransactionDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  })
}

export function TransactionsList({ transactions, onViewAll, onAdd }: TransactionsListProps) {
  const { formatCurrency } = useAppPreferences()

  return (
    <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <button onClick={onViewAll} className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
          View all
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 px-5 py-10 text-center">
          <p className="font-medium text-foreground">No transactions yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Add your first income or expense to populate this feed.</p>
          <button onClick={onAdd} className="mt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            Add a transaction
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const Icon = categoryIcons[transaction.category.toLowerCase()] || CreditCard

            return (
              <div
                key={transaction.id}
                className="group flex cursor-pointer items-center justify-between rounded-xl bg-secondary/30 p-4 transition-all duration-200 hover:bg-secondary/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                      transaction.type === "income"
                        ? "bg-chart-1/20 text-chart-1"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{formatTransactionDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-semibold", transaction.type === "income" ? "text-chart-1" : "text-foreground")}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
                  </span>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-chart-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
