"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/landing/hero-section"
import { MainApp } from "@/components/main-app"
import { cn } from "@/lib/utils"

export function AppWrapper() {
  const [showApp, setShowApp] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleEnterApp = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowApp(true)
    }, 500)
  }

  useEffect(() => {
    if (showApp) {
      const timer = setTimeout(() => setIsTransitioning(false), 100)
      return () => clearTimeout(timer)
    }
  }, [showApp])

  if (!showApp) {
    return (
      <div
        className={cn(
          "transition-opacity duration-500",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <HeroSection onEnterApp={handleEnterApp} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        isTransitioning ? "opacity-0" : "opacity-100"
      )}
    >
      <MainApp />
    </div>
  )
}
