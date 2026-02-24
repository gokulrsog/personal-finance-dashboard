"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const expenseData = [
  { name: "Housing", value: 2800, color: "#4ade80" },
  { name: "Food", value: 1200, color: "#38bdf8" },
  { name: "Transport", value: 800, color: "#fbbf24" },
  { name: "Shopping", value: 1500, color: "#f87171" },
  { name: "Entertainment", value: 600, color: "#a78bfa" },
  { name: "Others", value: 1330, color: "#94a3b8" },
]

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="text-sm font-medium text-foreground">{data.name}</p>
        </div>
        <p className="text-lg font-bold text-foreground">
          ${data.value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function ExpenseChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-[200px] w-full animate-pulse rounded-lg bg-secondary/50" />
    )
  }

  const total = expenseData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[180px] w-[180px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-bold text-foreground">${(total / 1000).toFixed(1)}k</p>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {expenseData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium text-foreground">${item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
