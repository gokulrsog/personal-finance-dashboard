import Link from "next/link"
import { ArrowLeft, BarChart3, PiggyBank, Sparkles, Wallet } from "lucide-react"
import type { ReactNode } from "react"

interface AuthShellProps {
  title: string
  description: string
  eyebrow: string
  alternateHref: string
  alternateLabel: string
  alternateText: string
  children: ReactNode
}

export function AuthShell({
  title,
  description,
  eyebrow,
  alternateHref,
  alternateLabel,
  alternateText,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[8%] right-[8%] h-80 w-80 rounded-full bg-chart-2/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:flex-row lg:items-center lg:gap-10 lg:px-10">
        <div className="flex flex-1 flex-col justify-between lg:min-h-[700px]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back Home
            </Link>

            <Link
              href={alternateHref}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {alternateText} <span className="text-primary">{alternateLabel}</span>
            </Link>
          </div>

          <div className="py-16 lg:py-0">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              {eyebrow}
            </div>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
                <Wallet className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm font-medium">Clean start</p>
                <p className="mt-2 text-sm text-muted-foreground">Every new account starts empty. No seeded transactions or fake balances.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
                <BarChart3 className="h-5 w-5 text-chart-2" />
                <p className="mt-4 text-sm font-medium">Live analytics</p>
                <p className="mt-2 text-sm text-muted-foreground">Reports and charts are generated from the data you add, not static demo values.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
                <PiggyBank className="h-5 w-5 text-chart-3" />
                <p className="mt-4 text-sm font-medium">AI guidance</p>
                <p className="mt-2 text-sm text-muted-foreground">The assistant responds with advice grounded in your own transactions and budgets.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg lg:flex-shrink-0">
          <div className="rounded-[28px] border border-border/60 bg-card/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
