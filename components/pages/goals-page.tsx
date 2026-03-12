"use client"

import { useEffect, useState } from "react"
import {
  Car,
  GraduationCap,
  Home,
  Laptop,
  Loader2,
  Plane,
  Plus,
  Shield,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type GoalRecord } from "@/lib/finance"
import { cn } from "@/lib/utils"

const goalCategories = [
  { value: "technology", label: "Technology", icon: Laptop, color: "primary" },
  { value: "travel", label: "Travel", icon: Plane, color: "chart-2" },
  { value: "emergency", label: "Emergency", icon: Shield, color: "chart-1" },
  { value: "vehicle", label: "Vehicle", icon: Car, color: "chart-3" },
  { value: "home", label: "Home", icon: Home, color: "chart-4" },
  { value: "education", label: "Education", icon: GraduationCap, color: "chart-5" },
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
  50: "Halfway there. Keep building.",
  75: "Almost there. Final push.",
  100: "Goal achieved. Nice work.",
}

function getMotivationalMessage(percentage: number) {
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
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="fill-none stroke-secondary" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("fill-none transition-all duration-1000", colors.ring)}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-2xl font-bold", colors.text)}>{Math.min(percentage, 100).toFixed(0)}%</span>
      </div>
    </div>
  )
}

function getGoalMeta(goal: GoalRecord) {
  return goalCategories.find((item) => item.value === goal.category) ?? goalCategories[0]
}

export function GoalsPage() {
  const [goals, setGoals] = useState<GoalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [fundingGoal, setFundingGoal] = useState<GoalRecord | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState(goalCategories[0].value)
  const [addAmount, setAddAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { addNotification, formatCurrency } = useAppPreferences()

  useEffect(() => {
    let isMounted = true

    async function loadGoals() {
      setLoading(true)
      try {
        const response = await fetch("/api/goals", { cache: "no-store" })
        const payload = await response.json()

        if (!isMounted) return
        setGoals(Array.isArray(payload) ? payload : [])
      } catch (error) {
        console.error("Error loading goals:", error)
        if (!isMounted) return
        setGoals([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadGoals()

    return () => {
      isMounted = false
    }
  }, [])

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length

  async function handleCreateGoal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          targetAmount,
          dueDate: dueDate || null,
          category,
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to create goal")
      }

      setGoals((previous) => [payload, ...previous])
      addNotification({
        title: "Goal created",
        description: `${name} has been set with a target of ${formatCurrency(Number(targetAmount))}.`,
        kind: "success",
      })
      setName("")
      setDescription("")
      setTargetAmount("")
      setDueDate("")
      setCategory(goalCategories[0].value)
      setCreateOpen(false)
    } catch (error) {
      console.error(error)
      addNotification({
        title: "Goal failed",
        description: "The savings goal could not be created. Please try again.",
        kind: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddFunds(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!fundingGoal) return

    setSubmitting(true)

    try {
      const newAmount = fundingGoal.currentAmount + Number(addAmount)
      const response = await fetch(`/api/goals/${fundingGoal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentAmount: `${newAmount}` }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to update goal")
      }

      setGoals((previous) => previous.map((goal) => (goal.id === payload.id ? payload : goal)))
      addNotification({
        title: payload.currentAmount >= payload.targetAmount ? "Goal completed" : "Funds added",
        description:
          payload.currentAmount >= payload.targetAmount
            ? `${payload.name} reached ${formatCurrency(payload.targetAmount)}.`
            : `${formatCurrency(Number(addAmount))} was added to ${payload.name}.`,
        kind: payload.currentAmount >= payload.targetAmount ? "success" : "info",
      })
      setAddAmount("")
      setFundingGoal(null)
    } catch (error) {
      console.error(error)
      addNotification({
        title: "Update failed",
        description: "The goal could not be updated. Please try again.",
        kind: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteGoal(id: string, goalName: string) {
    const response = await fetch(`/api/goals/${id}`, { method: "DELETE" })
    if (!response.ok) {
      addNotification({
        title: "Delete failed",
        description: "The goal could not be removed. Please try again.",
        kind: "error",
      })
      return
    }
    setGoals((previous) => previous.filter((goal) => goal.id !== id))
    addNotification({
      title: "Goal removed",
      description: `${goalName} was removed from your savings plan.`,
      kind: "warning",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Track your progress toward the financial targets you actually care about.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Goal</DialogTitle>
              <DialogDescription>Set a target amount and track how close you are.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal name</Label>
                <Input id="goal-name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target amount</Label>
                <Input id="goal-target" type="number" min="0" step="0.01" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <select id="goal-category" value={category} onChange={(event) => setCategory(event.target.value)} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  {goalCategories.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-date">Target date</Label>
                <Input id="goal-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-description">Notes</Label>
                <Textarea id="goal-description" value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-[90px]" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving
                    </span>
                  ) : (
                    "Save goal"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalSaved)}</p>
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
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalTarget)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20 text-chart-1">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goals Completed</p>
              <p className="text-xl font-bold text-foreground">{completedGoals} of {goals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-xl bg-secondary/40" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-card p-10 text-center">
          <h3 className="text-lg font-semibold text-foreground">No goals yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create a goal and start tracking how much you have already saved toward it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
            const isComplete = percentage >= 100
            const meta = getGoalMeta(goal)
            const colors = colorMap[meta.color]

            return (
              <div
                key={goal.id}
                className={cn(
                  "group rounded-xl border bg-card p-6 transition-all hover:shadow-lg",
                  isComplete ? "border-chart-1/50 hover:border-chart-1" : "border-border/50 hover:border-primary/30"
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105", colors.bg)}>
                    <meta.icon className={cn("h-6 w-6", colors.text)} />
                  </div>
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-chart-1/20 px-2 py-1 text-xs font-medium text-chart-1">
                        <Sparkles className="h-3 w-3" />
                        Complete
                      </span>
                    ) : null}
                    <button onClick={() => handleDeleteGoal(goal.id, goal.name)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="mb-1 font-semibold text-foreground">{goal.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">Target: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "No deadline"}</p>

                <div className="flex items-center justify-between gap-4">
                  <ProgressRing percentage={percentage} color={meta.color} size={100} />
                  <div className="text-right">
                    <p className={cn("text-2xl font-bold", colors.text)}>{formatCurrency(goal.currentAmount)}</p>
                    <p className="text-sm text-muted-foreground">of {formatCurrency(goal.targetAmount)}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatCurrency(Math.max(goal.targetAmount - goal.currentAmount, 0))} to go</p>
                  </div>
                </div>

                <div className={cn("mt-4 rounded-lg p-3 text-center text-sm", isComplete ? "bg-chart-1/10 text-chart-1" : "bg-secondary/50 text-muted-foreground")}>
                  {getMotivationalMessage(percentage)}
                </div>

                {!isComplete ? (
                  <Button variant="outline" className="mt-4 w-full bg-transparent" onClick={() => setFundingGoal(goal)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Funds
                  </Button>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={Boolean(fundingGoal)} onOpenChange={(open) => (!open ? setFundingGoal(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>Increase progress for {fundingGoal?.name ?? "this goal"}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFunds} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount</Label>
              <Input id="add-amount" type="number" min="0" step="0.01" value={addAmount} onChange={(event) => setAddAmount(event.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating
                  </span>
                ) : (
                  "Add funds"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
