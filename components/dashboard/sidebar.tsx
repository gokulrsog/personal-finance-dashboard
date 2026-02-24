"use client"

import React from "react"

import { useState } from "react"
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
  ChevronLeft,
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

interface SidebarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out hidden lg:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-[0_0_20px_rgba(74,222,128,0.3)]">
          F
        </div>
        {!collapsed && (
          <span className="text-xl font-semibold text-sidebar-foreground">
            FinTrack
          </span>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground hover:bg-sidebar-accent transition-colors"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>

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
              {!collapsed && <span>{item.label}</span>}
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
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Help</span>}
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}
