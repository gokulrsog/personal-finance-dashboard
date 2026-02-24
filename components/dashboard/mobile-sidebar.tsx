"use client"

import React from "react"

import { useEffect } from "react"
import {
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  Wallet,
  BarChart3,
  Target,
  FileText,
  Settings,
  HelpCircle,
  X,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PageType } from "@/components/main-app"

const navItems: { icon: React.ElementType; label: string; page: PageType }[] = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: ArrowLeftRight, label: "Transactions", page: "transactions" },
  { icon: PlusCircle, label: "Add Transaction", page: "add" },
  { icon: Wallet, label: "Budgets", page: "budgets" },
  { icon: BarChart3, label: "Analytics", page: "analytics" },
  { icon: Target, label: "Goals", page: "goals" },
  { icon: FileText, label: "Reports", page: "reports" },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

export function MobileSidebar({ open, onClose, currentPage, onNavigate }: MobileSidebarProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              F
            </div>
            <span className="text-xl font-semibold text-sidebar-foreground">
              FinTrack
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.page
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t border-sidebar-border p-4 space-y-1">
          <button
            onClick={() => onNavigate("settings")}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
              currentPage === "settings"
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Settings className={cn("h-5 w-5 flex-shrink-0", currentPage === "settings" && "text-primary")} />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span>Help</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
