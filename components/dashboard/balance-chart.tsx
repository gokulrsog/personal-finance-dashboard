"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"

interface BalanceChartProps {
  data: Array<{ month: string; balance: number }>
}

function CustomTooltip({
  active,
  payload,
  label,
  formatCurrency,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function BalanceChart({ data }: BalanceChartProps) {
  const [mounted, setMounted] = useState(false)
  const hasData = data.some((point) => point.balance > 0)
  const { formatCurrency } = useAppPreferences()

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="h-[200px] w-full animate-pulse rounded-lg bg-secondary/50" />
  }

  if (!hasData) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-secondary/20 text-sm text-muted-foreground">
        Your balance trend will appear after you add transactions.
      </div>
    )
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(Number(value), { notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 })}
            width={72}
          />
          <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
          <Area type="monotone" dataKey="balance" stroke="#4ade80" strokeWidth={2} fill="url(#balanceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
