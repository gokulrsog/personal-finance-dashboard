import {
  BadgeDollarSign,
  Briefcase,
  Car,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Landmark,
  ShoppingBag,
  Utensils,
  Zap,
} from "lucide-react"

export const expenseCategories = [
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "bg-chart-4/20 text-chart-4 border-chart-4/30" },
  { id: "housing", label: "Housing", icon: Home, color: "bg-primary/20 text-primary border-primary/30" },
  { id: "transport", label: "Transport", icon: Car, color: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  { id: "food", label: "Food", icon: Utensils, color: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  { id: "entertainment", label: "Entertainment", icon: Gamepad2, color: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
  { id: "health", label: "Health", icon: Heart, color: "bg-destructive/20 text-destructive border-destructive/30" },
  { id: "utilities", label: "Utilities", icon: Zap, color: "bg-muted text-muted-foreground border-muted-foreground/30" },
] as const

export const incomeCategories = [
  { id: "salary", label: "Salary", icon: Briefcase, color: "bg-chart-1/20 text-chart-1 border-chart-1/30" },
  { id: "freelance", label: "Freelance", icon: BadgeDollarSign, color: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  { id: "business", label: "Business", icon: Landmark, color: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  { id: "gift", label: "Gift", icon: Gift, color: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
] as const

export const paymentModes = [
  { id: "cash", label: "Cash" },
  { id: "credit", label: "Credit Card" },
  { id: "debit", label: "Debit Card" },
  { id: "bank", label: "Bank Transfer" },
  { id: "paypal", label: "PayPal" },
  { id: "upi", label: "UPI" },
] as const

export const allTransactionCategories = [...expenseCategories, ...incomeCategories]

export function findTransactionCategoryLabel(id: string) {
  return allTransactionCategories.find((category) => category.id === id)?.label || id
}

export function findPaymentLabel(id: string) {
  return paymentModes.find((paymentMode) => paymentMode.id === id)?.label || id
}