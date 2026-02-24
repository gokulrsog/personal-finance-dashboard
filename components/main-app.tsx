"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { Header } from "@/components/dashboard/header"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { TransactionsPage } from "@/components/pages/transactions-page"
import { AddTransactionPage } from "@/components/pages/add-transaction-page"
import { BudgetsPage } from "@/components/pages/budgets-page"
import { AnalyticsPage } from "@/components/pages/analytics-page"
import { GoalsPage } from "@/components/pages/goals-page"
import { ReportsPage } from "@/components/pages/reports-page"
import { SettingsPage } from "@/components/pages/settings-page"

export type PageType = "dashboard" | "transactions" | "add" | "budgets" | "analytics" | "goals" | "reports" | "settings"

export function MainApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} />
      case "transactions":
        return <TransactionsPage />
      case "add":
        return <AddTransactionPage onNavigate={setCurrentPage} />
      case "budgets":
        return <BudgetsPage />
      case "analytics":
        return <AnalyticsPage />
      case "goals":
        return <GoalsPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        open={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page)
          setMobileMenuOpen(false)
        }}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 sm:p-6 animate-in fade-in duration-300">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
