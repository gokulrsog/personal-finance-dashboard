"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { type PieDatum } from "@/lib/finance"

interface ExpenseChartProps {
  data: PieDatum[]
}

function CustomTooltip({
  active,
  payload,
  formatCurrency,
}: {
  active?: boolean
  payload?: Array<{ payload: PieDatum }>
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
          <p className="text-sm font-medium text-foreground">{data.name}</p>
        </div>
        <p className="text-lg font-bold text-foreground">{formatCurrency(data.value)}</p>
      </div>
    )
  }
  return null
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const [mounted, setMounted] = useState(false)
  const { formatCurrency } = useAppPreferences()

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="h-[200px] w-full animate-pulse rounded-lg bg-secondary/50" />
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-secondary/20 text-sm text-muted-foreground">
        No expense categories yet for this month.
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[180px] w-[180px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(total, { notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 })}</p>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium text-foreground">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
