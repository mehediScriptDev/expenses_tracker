"use client"

import { OverviewPanel } from "@/dashboard/dashboard/overview-panel"
import { QuickAddBar } from "@/dashboard/quick-add-bar"
import { WarningsBanner } from "@/dashboard/dashboard/warnings-banner"
import { CategoryBreakdown } from "@/dashboard/dashboard/category-breakdown"
import { BorrowedSummary } from "@/dashboard/dashboard/borrowed-summary"
import { RecentTransactions } from "@/dashboard/dashboard/recent-transactions"
import { DashPage } from "@/dashboard/shared"

export default function DashboardPage() {
  return (
    <DashPage>
      <OverviewPanel />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <CategoryBreakdown />
          <RecentTransactions />
        </div>

        <aside className="space-y-6 xl:col-span-4 xl:sticky xl:top-18 xl:self-start">
          <QuickAddBar />
          <WarningsBanner />
          <BorrowedSummary />
        </aside>
      </div>
    </DashPage>
  )
}
