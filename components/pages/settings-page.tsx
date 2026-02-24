"use client"

import { useState } from "react"
import {
  User,
  Moon,
  Sun,
  Globe,
  Bell,
  Lock,
  Trash2,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "E", name: "Euro" },
  { code: "GBP", symbol: "P", name: "British Pound" },
  { code: "INR", symbol: "R", name: "Indian Rupee" },
  { code: "JPY", symbol: "Y", name: "Japanese Yen" },
]

export function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetConfirmText, setResetConfirmText] = useState("")

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile
        </h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-2xl font-bold text-primary-foreground">
            JD
          </div>
          <div>
            <h3 className="font-semibold text-foreground">John Doe</h3>
            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            <Button variant="link" className="p-0 h-auto text-primary text-sm">
              Edit Profile
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
            <Input id="name" defaultValue="John Doe" className="mt-1.5 bg-secondary/30 border-border/50" />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-1.5 bg-secondary/30 border-border/50" />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          {isDarkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Dark Mode</p>
            <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>
      </div>

      {/* Currency Section */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Currency
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={cn(
                "flex items-center justify-between rounded-lg border-2 p-3 transition-all",
                selectedCurrency === currency.code
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-secondary/30 hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{currency.symbol}</span>
                <span className="text-sm text-muted-foreground">{currency.code}</span>
              </div>
              {selectedCurrency === currency.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts for budget limits and goals</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Get weekly summary emails</p>
            </div>
            <Switch
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Security
        </h2>
        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
          <div className="text-left">
            <p className="font-medium text-foreground">Change Password</p>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you reset your data, there is no going back. Please be certain.
        </p>
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Reset All Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">Reset All Data</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete all your transactions, budgets, and goals.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="confirm" className="text-sm text-muted-foreground">
                Type <span className="font-mono text-destructive">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm"
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                className="mt-2"
                placeholder="DELETE"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={resetConfirmText !== "DELETE"}
                onClick={() => {
                  setShowResetDialog(false)
                  setResetConfirmText("")
                }}
              >
                Reset Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logout */}
      <Button variant="outline" className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 bg-transparent">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )
}
