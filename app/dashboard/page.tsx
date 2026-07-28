"use client"

import { AppShell } from "@/components/app-shell"
import { HeroCard } from "@/components/dashboard/hero-card"
import { StatCards } from "@/components/dashboard/stat-cards"
import { QuickAddBar } from "@/components/quick-add-bar"
import { WarningsBanner } from "@/components/dashboard/warnings-banner"
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown"
import { BorrowedSummary } from "@/components/dashboard/borrowed-summary"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8 w-full">
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
