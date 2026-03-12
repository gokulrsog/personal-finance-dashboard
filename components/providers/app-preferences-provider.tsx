"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "INR" | "JPY"
export type NotificationKind = "info" | "success" | "warning" | "error"

export type AppNotification = {
  id: string
  title: string
  description: string
  createdAt: string
  read: boolean
  kind: NotificationKind
  dedupeKey?: string
}

type Preferences = {
  selectedCurrency: SupportedCurrency
  notificationsEnabled: boolean
  emailAlertsEnabled: boolean
}

type StoredPreferences = Partial<Preferences> & {
  notifications?: boolean
  emailAlerts?: boolean
}

type AddNotificationInput = {
  title: string
  description: string
  kind?: NotificationKind
  dedupeKey?: string
  silent?: boolean
}

type AppPreferencesContextValue = {
  selectedCurrency: SupportedCurrency
  notificationsEnabled: boolean
  emailAlertsEnabled: boolean
  notifications: AppNotification[]
  unreadNotificationCount: number
  setSelectedCurrency: (currency: SupportedCurrency) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setEmailAlertsEnabled: (enabled: boolean) => void
  addNotification: (input: AddNotificationInput) => void
  markAllNotificationsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string
}

const preferencesStorageKey = "wealth-track-preferences"
const legacyPreferencesStorageKey = "finance-tracker-preferences"
const notificationsStorageKey = "wealth-track-notifications"
const preferencesMigrationKey = "wealth-track-preferences-migration-v2"

const defaultPreferences: Preferences = {
  selectedCurrency: "INR",
  notificationsEnabled: true,
  emailAlertsEnabled: false,
}

const validCurrencies: SupportedCurrency[] = ["USD", "EUR", "GBP", "INR", "JPY"]

const currencyLocales: Record<SupportedCurrency, string> = {
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  INR: "en-IN",
  JPY: "ja-JP",
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null)

function createNotificationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    let nextPreferences = defaultPreferences
    const savedPreferences =
      window.localStorage.getItem(preferencesStorageKey) ??
      window.localStorage.getItem(legacyPreferencesStorageKey)

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences) as StoredPreferences
        const parsedCurrency = validCurrencies.includes(parsed.selectedCurrency as SupportedCurrency)
          ? (parsed.selectedCurrency as SupportedCurrency)
          : undefined

        const hasMigratedCurrencyDefault = window.localStorage.getItem(preferencesMigrationKey) === "true"
        const shouldMigrateOldUsdDefault = !hasMigratedCurrencyDefault && parsedCurrency === "USD"

        nextPreferences = {
          selectedCurrency: shouldMigrateOldUsdDefault ? "INR" : parsedCurrency || defaultPreferences.selectedCurrency,
          notificationsEnabled: parsed.notificationsEnabled ?? parsed.notifications ?? defaultPreferences.notificationsEnabled,
          emailAlertsEnabled: parsed.emailAlertsEnabled ?? parsed.emailAlerts ?? defaultPreferences.emailAlertsEnabled,
        }

        if (shouldMigrateOldUsdDefault || !hasMigratedCurrencyDefault) {
          window.localStorage.setItem(preferencesMigrationKey, "true")
        }
      } catch {
        window.localStorage.removeItem(preferencesStorageKey)
      }
    } else {
      window.localStorage.setItem(preferencesMigrationKey, "true")
    }

    let nextNotifications: AppNotification[] = []
    const savedNotifications = window.localStorage.getItem(notificationsStorageKey)
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications) as AppNotification[]
        nextNotifications = Array.isArray(parsed) ? parsed : []
      } catch {
        window.localStorage.removeItem(notificationsStorageKey)
      }
    }

    const timer = window.setTimeout(() => {
      setPreferences(nextPreferences)
      setNotifications(nextNotifications)
      setHasHydrated(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences))
  }, [hasHydrated, preferences])

  useEffect(() => {
    if (!hasHydrated) return

    window.localStorage.setItem(notificationsStorageKey, JSON.stringify(notifications.slice(0, 25)))
  }, [hasHydrated, notifications])

  function setSelectedCurrency(currency: SupportedCurrency) {
    setPreferences((current) => ({ ...current, selectedCurrency: currency }))
  }

  function setNotificationsEnabled(enabled: boolean) {
    setPreferences((current) => ({ ...current, notificationsEnabled: enabled }))
  }

  function setEmailAlertsEnabled(enabled: boolean) {
    setPreferences((current) => ({ ...current, emailAlertsEnabled: enabled }))
  }

  function addNotification({ title, description, kind = "info", dedupeKey, silent = false }: AddNotificationInput) {
    if (!preferences.notificationsEnabled && !silent) {
      return
    }

    const nextNotification: AppNotification = {
      id: createNotificationId(),
      title,
      description,
      createdAt: new Date().toISOString(),
      read: false,
      kind,
      dedupeKey,
    }

    setNotifications((current) => {
      if (dedupeKey) {
        const existing = current.find((notification) => notification.dedupeKey === dedupeKey)

        if (existing) {
          return current.map((notification) =>
            notification.dedupeKey === dedupeKey
              ? {
                  ...notification,
                  title,
                  description,
                  createdAt: nextNotification.createdAt,
                  read: false,
                  kind,
                }
              : notification
          )
        }
      }

      return [nextNotification, ...current].slice(0, 25)
    })

    if (!silent && preferences.notificationsEnabled) {
      toast({
        title,
        description,
        variant: kind === "error" ? "destructive" : undefined,
      })

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted" &&
        document.visibilityState !== "visible"
      ) {
        try {
          new Notification(title, { body: description })
        } catch {
          // Browser notification support varies by platform and permission state.
        }
      }
    }
  }

  function markAllNotificationsRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }

  function removeNotification(id: string) {
    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }

  function clearNotifications() {
    setNotifications([])
  }

  function formatCurrency(value: number, options: Intl.NumberFormatOptions = {}) {
    const amount = Number.isFinite(value) ? value : 0
    return new Intl.NumberFormat(currencyLocales[preferences.selectedCurrency], {
      style: "currency",
      currency: preferences.selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount)
  }

  const value: AppPreferencesContextValue = {
    selectedCurrency: preferences.selectedCurrency,
    notificationsEnabled: preferences.notificationsEnabled,
    emailAlertsEnabled: preferences.emailAlertsEnabled,
    notifications,
    unreadNotificationCount: notifications.filter((notification) => !notification.read).length,
    setSelectedCurrency,
    setNotificationsEnabled,
    setEmailAlertsEnabled,
    addNotification,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
    formatCurrency,
  }

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext)

  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider")
  }

  return context
}