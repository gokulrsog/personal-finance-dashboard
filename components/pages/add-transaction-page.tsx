"use client"

import React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Tag,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Gamepad2,
  Briefcase,
  Heart,
  Zap,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { PageType } from "@/components/main-app"

const categories = [
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "bg-chart-4/20 text-chart-4 border-chart-4/30" },
  { id: "housing", label: "Housing", icon: Home, color: "bg-primary/20 text-primary border-primary/30" },
  { id: "transport", label: "Transport", icon: Car, color: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  { id: "food", label: "Food", icon: Utensils, color: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  { id: "entertainment", label: "Entertainment", icon: Gamepad2, color: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
  { id: "income", label: "Income", icon: Briefcase, color: "bg-chart-1/20 text-chart-1 border-chart-1/30" },
  { id: "health", label: "Health", icon: Heart, color: "bg-destructive/20 text-destructive border-destructive/30" },
  { id: "utilities", label: "Utilities", icon: Zap, color: "bg-muted text-muted-foreground border-muted-foreground/30" },
]

const paymentModes = [
  { id: "cash", label: "Cash" },
  { id: "credit", label: "Credit Card" },
  { id: "debit", label: "Debit Card" },
  { id: "bank", label: "Bank Transfer" },
  { id: "paypal", label: "PayPal" },
  { id: "upi", label: "UPI" },
]

interface AddTransactionPageProps {
  onNavigate: (page: PageType) => void
}

export function AddTransactionPage({ onNavigate }: AddTransactionPageProps) {
  const [type, setType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Reset form after showing success
    setTimeout(() => {
      setShowSuccess(false)
      setAmount("")
      setSelectedCategory("")
      setSelectedPayment("")
      setNotes("")
      setDate(new Date().toISOString().split("T")[0])
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Transaction Added!</h2>
          <p className="text-muted-foreground">Your transaction has been recorded successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("dashboard")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Transaction</h1>
          <p className="text-sm text-muted-foreground">Record a new income or expense</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Toggle */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <Label className="text-sm font-medium text-foreground mb-3 block">Transaction Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all",
                type === "expense"
                  ? "border-chart-4 bg-chart-4/10 text-chart-4"
                  : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-chart-4/50"
              )}
            >
              <span className="font-medium">Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all",
                type === "income"
                  ? "border-chart-1 bg-chart-1/10 text-chart-1"
                  : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-chart-1/50"
              )}
            >
              <span className="font-medium">Income</span>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <Label htmlFor="amount" className="text-sm font-medium text-foreground mb-3 block">
            Amount
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-12 h-14 text-2xl font-bold bg-secondary/30 border-border/50"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Category
          </Label>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all",
                  selectedCategory === category.id
                    ? category.color
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                )}
              >
                <category.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <Label htmlFor="date" className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 bg-secondary/30 border-border/50"
            required
          />
        </div>

        {/* Payment Mode */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Mode
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {paymentModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedPayment(mode.id)}
                className={cn(
                  "rounded-lg border-2 p-3 text-sm font-medium transition-all",
                  selectedPayment === mode.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <Label htmlFor="notes" className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] bg-secondary/30 border-border/50 resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !amount || !selectedCategory || !selectedPayment}
          className={cn(
            "w-full h-14 text-lg font-semibold transition-all",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]",
            "disabled:opacity-50 disabled:shadow-none"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Adding...
            </div>
          ) : (
            `Add ${type === "income" ? "Income" : "Expense"}`
          )}
        </Button>
      </form>
    </div>
  )
}
