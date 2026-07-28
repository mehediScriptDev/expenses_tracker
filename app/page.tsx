"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { LandingHero } from "@/components/landing-hero"
import { WarningsBanner } from "@/components/dashboard/warnings-banner"
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BorrowedSummary } from "@/components/dashboard/borrowed-summary"
import { StatCards } from "@/components/dashboard/stat-cards"
import { HeroCard } from "@/components/dashboard/hero-card"
import { QuickAddBar } from "@/components/quick-add-bar"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [showLanding, setShowLanding] = React.useState(true)

  if (showLanding) {
    return (
      <div className="relative">
        <LandingHero />
        
        {/* Floating Switcher Bar */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-neutral-900 bg-white p-1.5 shadow-2xl">
          <Button
            size="sm"
            onClick={() => setShowLanding(false)}
          >
            Go to App Dashboard →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-neutral-200">
          <span className="text-xs font-bold text-neutral-600">Currently viewing App Dashboard</span>
          <Button variant="outline" size="sm" onClick={() => setShowLanding(true)}>
            ← Back to Landing Page
          </Button>
        </div>

        <HeroCard />
        <StatCards />
        <QuickAddBar />
        <WarningsBanner />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CategoryBreakdown />
          </div>
          <BorrowedSummary />
        </div>

        <RecentTransactions />
      </div>
    </AppShell>
  )
}
