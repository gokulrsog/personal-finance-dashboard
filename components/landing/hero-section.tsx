"use client"

import React from "react"

import { useState, useEffect } from "react"
import { ArrowRight, TrendingUp, Wallet, PiggyBank, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function AnimatedCounter({ target, duration = 2000, prefix = "", suffix = "" }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isVisible, target, duration])

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

function FloatingIcon({ icon: Icon, className, delay = 0 }: { icon: React.ElementType; className?: string; delay?: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "absolute p-3 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border shadow-lg transition-all duration-1000",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="h-6 w-6 text-primary" />
    </div>
  )
}

interface HeroSectionProps {
  onEnterApp: () => void
}

export function HeroSection({ onEnterApp }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Floating icons */}
      <FloatingIcon icon={Wallet} className="top-[15%] left-[10%] animate-[float_6s_ease-in-out_infinite]" delay={200} />
      <FloatingIcon icon={TrendingUp} className="top-[20%] right-[15%] animate-[float_5s_ease-in-out_infinite]" delay={400} />
      <FloatingIcon icon={PiggyBank} className="bottom-[25%] left-[15%] animate-[float_7s_ease-in-out_infinite]" delay={600} />
      <FloatingIcon icon={BarChart3} className="bottom-[20%] right-[10%] animate-[float_6s_ease-in-out_infinite]" delay={800} />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border backdrop-blur-sm mb-8 transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI-Powered Finance Tracking</span>
        </div>

        {/* Headline */}
        <h1
          className={cn(
            "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="block">Track smarter.</span>
          <span className="block bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
            Spend wiser.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 leading-relaxed",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Take control of your finances with intelligent insights, beautiful analytics, 
          and AI-powered recommendations. Your journey to financial freedom starts here.
        </p>

        {/* Stats */}
        <div
          className={cn(
            "grid grid-cols-3 gap-8 max-w-lg mx-auto mb-12 transition-all duration-700 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">
              <AnimatedCounter target={50} suffix="K+" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">
              <AnimatedCounter target={2} prefix="$" suffix="M+" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">Tracked Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">
              <AnimatedCounter target={99} suffix="%" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "transition-all duration-700 delay-400",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            onClick={onEnterApp}
            size="lg"
            className="group relative px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_30px_rgba(74,222,128,0.3)] hover:shadow-[0_0_40px_rgba(74,222,128,0.4)] transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">Free to use. No credit card required.</p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
