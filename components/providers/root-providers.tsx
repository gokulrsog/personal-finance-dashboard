"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AppPreferencesProvider } from "@/components/providers/app-preferences-provider"

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppPreferencesProvider>
        {children}
        <Toaster />
      </AppPreferencesProvider>
    </ThemeProvider>
  )
}