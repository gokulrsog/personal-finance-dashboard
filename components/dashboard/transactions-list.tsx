"use client"

import { 
  ShoppingBag, 
  Coffee, 
  Zap, 
  Utensils, 
  Car, 
  Music,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const transactions = [
  {
    id: 1,
    name: "Salary Deposit",
    category: "Income",
    amount: 5200.00,
    type: "income",
    date: "Today, 9:00 AM",
    icon: Briefcase,
  },
  {
    id: 2,
    name: "Apple Store",
    category: "Shopping",
    amount: 1299.99,
    type: "expense",
    date: "Today, 2:30 PM",
    icon: ShoppingBag,
  },
  {
    id: 3,
    name: "Starbucks",
    category: "Food & Drink",
    amount: 7.50,
    type: "expense",
    date: "Yesterday, 8:15 AM",
    icon: Coffee,
  },
  {
    id: 4,
    name: "Electric Bill",
    category: "Utilities",
    amount: 145.00,
    type: "expense",
    date: "Yesterday, 11:00 AM",
    icon: Zap,
  },
  {
    id: 5,
    name: "Restaurant",
    category: "Food & Drink",
    amount: 86.50,
    type: "expense",
    date: "Jan 22, 7:30 PM",
    icon: Utensils,
  },
  {
    id: 6,
    name: "Uber",
    category: "Transport",
    amount: 24.99,
    type: "expense",
    date: "Jan 22, 5:45 PM",
    icon: Car,
  },
  {
    id: 7,
    name: "Spotify",
    category: "Subscription",
    amount: 9.99,
    type: "expense",
    date: "Jan 21, 12:00 AM",
    icon: Music,
  },
]

export function TransactionsList() {
  return (
    <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-xl bg-secondary/30 p-4 transition-all duration-200 hover:bg-secondary/50 group cursor-pointer"
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
                <transaction.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-semibold",
                  transaction.type === "income" ? "text-chart-1" : "text-foreground"
                )}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
              {transaction.type === "income" ? (
                <ArrowUpRight className="h-4 w-4 text-chart-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
