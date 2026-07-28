"use client"

import { useStore } from "@/lib/store"
import { computeDashboard } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { ProgressBar } from "@/components/shared"
import { useUI } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroCard() {
  const { data } = useStore()
  const ui = useUI()
  const m = computeDashboard(data)
  const cyclePct = m.cycleBudget > 0 ? (m.cycleSpending / m.cycleBudget) * 100 : 0

  return (
    <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden dark:bg-card dark:border-neutral-700">
      {/* Top Yellow Bar */}
      <div className="bg-[#FFD000] px-6 py-3 flex items-center justify-between border-b border-neutral-200">
        <span className="font-serif font-black text-sm text-neutral-900 tracking-tight">
          Personal Finance Dashboard
        </span>
        <Button
          onClick={ui.openAdd}
          variant="secondary"
          size="sm"
        >
          + Add Transaction
        </Button>
      </div>

      {/* Main body */}
      <div className="p-6 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="space-y-4 max-w-lg">
          <h1 className="font-serif text-4xl font-black tracking-tight text-neutral-900 dark:text-foreground leading-tight">
            Your money,<br />your clarity.
          </h1>
          <p className="text-sm text-neutral-500 dark:text-muted-foreground leading-relaxed">
            Track daily expenses, stay within budget, monitor salary pacing and reach payday without stress.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={ui.openAdd}
              size="lg"
            >
              Add Expense
            </Button>
            <Button
              variant="outline"
              size="lg"
            >
              <Link href="/insights">
                View Insights
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: balance card */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-muted p-5 min-w-60 space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-muted-foreground">
              Available Balance
            </p>
            <p className="mt-1 font-mono text-3xl font-black text-neutral-900 dark:text-foreground tabular-nums">
              {formatMoney(m.currentBalance, { symbol: data.settings.currencySymbol })}
            </p>
          </div>
          <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-muted-foreground">
              <span>Salary cycle</span>
              <span className="font-bold text-neutral-900 dark:text-foreground">{Math.round(cyclePct)}%</span>
            </div>
            <ProgressBar value={cyclePct} tone={cyclePct > 90 ? "danger" : "primary"} className="h-2" />
            <div className="flex justify-between text-[11px] text-neutral-400 dark:text-muted-foreground">
              <span>Safe: {formatMoney(m.safeDailyLimit, { symbol: data.settings.currencySymbol })}/day</span>
              <span>{m.daysRemaining}d left</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
