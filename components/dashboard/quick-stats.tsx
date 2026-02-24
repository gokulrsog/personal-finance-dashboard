"use client"

import { CreditCard, Target, PiggyBank, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Cards Active",
    value: "4",
    change: "+1 new",
    trend: "up",
    icon: CreditCard,
    color: "chart-2",
  },
  {
    label: "Monthly Goal",
    value: "78%",
    change: "$2,200 left",
    trend: "up",
    icon: Target,
    color: "chart-3",
  },
  {
    label: "Savings",
    value: "$12,480",
    change: "+$820",
    trend: "up",
    icon: PiggyBank,
    color: "primary",
  },
  {
    label: "Investments",
    value: "$8,250",
    change: "+5.2%",
    trend: "up",
    icon: TrendingUp,
    color: "chart-1",
  },
]

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  "chart-1": { bg: "bg-chart-1/15", text: "text-chart-1", icon: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/15", text: "text-chart-2", icon: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/15", text: "text-chart-3", icon: "text-chart-3" },
  "primary": { bg: "bg-primary/15", text: "text-primary", icon: "text-primary" },
}

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const colors = colorMap[stat.color]
        return (
          <div
            key={stat.label}
            className="group rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105", colors.bg)}>
                <stat.icon className={cn("h-5 w-5", colors.icon)} />
              </div>
              <span className={cn("text-xs font-medium", colors.text)}>
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
