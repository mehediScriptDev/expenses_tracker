"use client"

import { HeroCard } from "@/dashboard/dashboard/hero-card"
import { StatCards } from "@/dashboard/dashboard/stat-cards"
import { QuickAddBar } from "@/dashboard/quick-add-bar"
import { WarningsBanner } from "@/dashboard/dashboard/warnings-banner"
import { CategoryBreakdown } from "@/dashboard/dashboard/category-breakdown"
import { BorrowedSummary } from "@/dashboard/dashboard/borrowed-summary"
import { RecentTransactions } from "@/dashboard/dashboard/recent-transactions"

export default function DashboardPage() {
  return (
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
  )
}
