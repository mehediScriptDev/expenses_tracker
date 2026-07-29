"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { computeDashboard } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { ProgressBar, dashLabel, dashCaption, dashHeroValue, dashStatValue, dashMeta } from "@/dashboard/shared"
import { useUI } from "@/dashboard/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

export function OverviewPanel() {
  const { data } = useStore()
  const ui = useUI()
  const m = computeDashboard(data)
  const cyclePct = m.cycleBudget > 0 ? (m.cycleSpending / m.cycleBudget) * 100 : 0

  const stats = [
    { label: "Today", value: formatMoney(m.todaySpending, { symbol: data.settings.currencySymbol }), icon: "sun" },
    { label: "This week", value: formatMoney(m.weekSpending, { symbol: data.settings.currencySymbol }), icon: "calendar-days" },
    { label: "This month", value: formatMoney(m.monthSpending, { symbol: data.settings.currencySymbol }), icon: "calendar-range" },
    {
      label: "Borrowed",
      value: formatMoney(m.borrowedOutstanding, { symbol: data.settings.currencySymbol }),
      icon: "hand-coins",
    },
  ]

  return (
    <section className="dash-hero">
      <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4 sm:space-y-5">
          <div>
            <p className={dashLabel}>Available balance</p>
            <p className={cn(dashHeroValue, "mt-2")}>
              {formatMoney(m.currentBalance, { symbol: data.settings.currencySymbol })}
            </p>
          </div>

          <div className="max-w-lg space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className={dashLabel}>Salary cycle spending</span>
              <span className="text-sm font-bold tabular-nums text-(--dash-text)">{Math.round(cyclePct)}% used</span>
            </div>
            <ProgressBar
              value={cyclePct}
              tone={cyclePct > 90 ? "danger" : "accent"}
              className="h-2.5"
            />
            <p className={dashCaption}>
              Safe to spend{" "}
              <strong className="font-bold text-(--dash-accent)">
                {formatMoney(m.safeDailyLimit, { symbol: data.settings.currencySymbol })}/day
              </strong>{" "}
              · {m.daysRemaining} days left in cycle
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
          <Button variant="dash" onClick={ui.openAdd} className="h-11 w-full px-6 sm:w-auto lg:w-full xl:w-auto">
            Add transaction
          </Button>
          <Button variant="outline" className="h-11 w-full px-6 sm:w-auto lg:w-full xl:w-auto" asChild>
            <Link href="/insights">View insights</Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 min-w-0 sm:mt-6 sm:gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 overflow-hidden rounded-xl bg-(--dash-surface) p-2.5 ring-1 ring-(--dash-border) sm:p-4">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--dash-accent-soft) text-(--dash-accent) sm:size-8">
                <Icon name={stat.icon} className="size-3.5 sm:size-4" aria-hidden />
              </span>
              <p className={cn(dashMeta, "min-w-0 flex-1 truncate text-[10px] tracking-normal sm:text-xs sm:tracking-wide")}>{stat.label}</p>
            </div>
            <p className={cn(dashStatValue, "mt-1.5 truncate text-base font-bold sm:mt-2 sm:text-xl")}>{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
