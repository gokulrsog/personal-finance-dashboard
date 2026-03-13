"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { Bell, CircleHelp, LogOut, Menu, Settings, X } from "lucide-react"
import type { PageType } from "@/components/main-app"
import { getInitials, type UserProfile } from "@/lib/finance"
import { useAppPreferences } from "@/components/providers/app-preferences-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface HeaderProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  onMenuClick?: () => void
}

const pageLabels: Record<PageType, string> = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  add: "Add Transaction",
  budgets: "Budgets",
  analytics: "Analytics",
  goals: "Goals",
  reports: "Reports",
  creators: "Creators",
  settings: "Settings",
  help: "Help",
}

function formatNotificationTime(dateString: string) {
  const elapsedMinutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)

  if (elapsedMinutes < 1) {
    return "Just now"
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) {
    return `${elapsedHours}h ago`
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function Header({ currentPage, onNavigate, onMenuClick }: HeaderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const {
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    clearNotifications,
    removeNotification,
  } = useAppPreferences()

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const response = await fetch("/api/users/profile", {
          cache: "no-store",
          credentials: "include",
        })

        if (!response.ok) {
          if (isMounted) {
            setProfile(null)
          }
          return
        }

        const data = await response.json()
        if (isMounted) {
          setProfile(data)
        }
      } catch {
        if (isMounted) {
          setProfile(null)
        }
      }
    }

    loadProfile()

    const handleFocus = () => {
      loadProfile()
    }

    const handleProfileUpdated = () => {
      loadProfile()
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("wealth-track:profile-updated", handleProfileUpdated)

    return () => {
      isMounted = false
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("wealth-track:profile-updated", handleProfileUpdated)
    }
  }, [])

  useEffect(() => {
    if (notificationsOpen) {
      markAllNotificationsRead()
    }
  }, [markAllNotificationsRead, notificationsOpen])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{pageLabels[currentPage]}</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.name ? `Welcome back, ${profile.name}` : "Manage your finances with your own data"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {mounted ? (
          <>
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Open notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadNotificationCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  ) : null}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[360px] p-0">
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <p className="text-xs text-muted-foreground">Recent in-app activity and alerts</p>
                  </div>
                  {notifications.length > 0 ? (
                    <button onClick={clearNotifications} className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
                      Clear all
                    </button>
                  ) : null}
                </div>

                <div className="max-h-[360px] space-y-2 overflow-y-auto p-3">
                  {notifications.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-secondary/20 px-4 py-8 text-center text-sm text-muted-foreground">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "rounded-lg border p-3",
                          notification.read ? "border-border/50 bg-secondary/20" : "border-primary/30 bg-primary/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          <div className="flex shrink-0 items-start gap-2">
                            <span className="text-xs text-muted-foreground">{formatNotificationTime(notification.createdAt)}</span>
                            <button
                              type="button"
                              aria-label="Remove notification"
                              onClick={() => removeNotification(notification.id)}
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-primary text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  {getInitials(profile?.name)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{profile?.name || "Your profile"}</p>
                    <p className="text-xs font-normal text-muted-foreground">{profile?.email || "Signed in user"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onNavigate("settings")}>
                  <Settings className="h-4 w-4" />
                  Open Settings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onNavigate("help")}>
                  <CircleHelp className="h-4 w-4" />
                  Help Center
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
              aria-hidden="true"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-primary text-sm font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {getInitials(profile?.name)}
            </button>
          </>
        )}
      </div>
    </header>
  )
}
