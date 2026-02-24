"use client"

import { useState } from "react"
import {
  Plus,
  Laptop,
  Plane,
  Car,
  Home,
  GraduationCap,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const goals = [
  {
    id: 1,
    name: "New MacBook Pro",
    icon: Laptop,
    target: 2500,
    saved: 1875,
    deadline: "Mar 2024",
    color: "primary",
  },
  {
    id: 2,
    name: "Summer Vacation",
    icon: Plane,
    target: 5000,
    saved: 3200,
    deadline: "Jun 2024",
    color: "chart-2",
  },
  {
    id: 3,
    name: "Emergency Fund",
    icon: Shield,
    target: 10000,
    saved: 8500,
    deadline: "Dec 2024",
    color: "chart-1",
  },
  {
    id: 4,
    name: "New Car Down Payment",
    icon: Car,
    target: 8000,
    saved: 2400,
    deadline: "Sep 2024",
    color: "chart-3",
  },
  {
    id: 5,
    name: "Home Renovation",
    icon: Home,
    target: 15000,
    saved: 4500,
    deadline: "Dec 2024",
    color: "chart-4",
  },
  {
    id: 6,
    name: "Online Course",
    icon: GraduationCap,
    target: 800,
    saved: 800,
    deadline: "Jan 2024",
    color: "chart-5",
  },
]

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  primary: { bg: "bg-primary/20", text: "text-primary", ring: "stroke-primary" },
  "chart-1": { bg: "bg-chart-1/20", text: "text-chart-1", ring: "stroke-chart-1" },
  "chart-2": { bg: "bg-chart-2/20", text: "text-chart-2", ring: "stroke-chart-2" },
  "chart-3": { bg: "bg-chart-3/20", text: "text-chart-3", ring: "stroke-chart-3" },
  "chart-4": { bg: "bg-chart-4/20", text: "text-chart-4", ring: "stroke-chart-4" },
  "chart-5": { bg: "bg-chart-5/20", text: "text-chart-5", ring: "stroke-chart-5" },
}

const motivationalMessages: Record<number, string> = {
  25: "Great start! Keep going!",
  50: "Halfway there! You got this!",
  75: "Almost there! Final push!",
  100: "Goal achieved! Congratulations!",
}

function getMotivationalMessage(percentage: number): string {
  if (percentage >= 100) return motivationalMessages[100]
  if (percentage >= 75) return motivationalMessages[75]
  if (percentage >= 50) return motivationalMessages[50]
  return motivationalMessages[25]
}

function ProgressRing({ percentage, color, size = 120 }: { percentage: number; color: string; size?: number }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference
  const colors = colorMap[color]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("fill-none transition-all duration-1000", colors.ring)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold", colors.text)}>{Math.min(percentage, 100).toFixed(0)}%</span>
      </div>
    </div>
  )
}

export function GoalsPage() {
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0)
  const completedGoals = goals.filter(g => g.saved >= g.target).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Track your progress towards financial goals</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-xl font-bold text-foreground">${totalSaved.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20 text-chart-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target Total</p>
              <p className="text-xl font-bold text-foreground">${totalTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20 text-chart-1">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goals Completed</p>
              <p className="text-xl font-bold text-foreground">{completedGoals} of {goals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const percentage = (goal.saved / goal.target) * 100
          const isComplete = percentage >= 100
          const colors = colorMap[goal.color]

          return (
            <div
              key={goal.id}
              className={cn(
                "group rounded-xl border bg-card p-6 transition-all hover:shadow-lg",
                isComplete
                  ? "border-chart-1/50 hover:border-chart-1"
                  : "border-border/50 hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105", colors.bg)}>
                  <goal.icon className={cn("h-6 w-6", colors.text)} />
                </div>
                {isComplete && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-chart-1/20 px-2 py-1 text-xs font-medium text-chart-1">
                    <Sparkles className="h-3 w-3" />
                    Complete
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-foreground mb-1">{goal.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Target: {goal.deadline}</p>

              <div className="flex items-center justify-between">
                <ProgressRing percentage={percentage} color={goal.color} size={100} />
                <div className="text-right">
                  <p className={cn("text-2xl font-bold", colors.text)}>
                    ${goal.saved.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    of ${goal.target.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ${(goal.target - goal.saved).toLocaleString()} to go
                  </p>
                </div>
              </div>

              {/* Motivational message */}
              <div className={cn(
                "mt-4 rounded-lg p-3 text-sm text-center",
                isComplete ? "bg-chart-1/10 text-chart-1" : "bg-secondary/50 text-muted-foreground"
              )}>
                {getMotivationalMessage(percentage)}
              </div>

              {/* Add funds button */}
              {!isComplete && (
                <Button
                  variant="outline"
                  className="w-full mt-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Add New Goal Card */}
      <div className="rounded-xl border-2 border-dashed border-border/50 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
        <div className="mx-auto h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
          <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Create New Goal</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Set a new savings goal and start tracking your progress towards financial freedom.
        </p>
      </div>
    </div>
  )
}
