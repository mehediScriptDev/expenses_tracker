"use client"

import * as React from "react"
import {
  PageHeader,
  EmptyState,
  ProgressBar,
  CategoryBadge,
  DashPage,
  StatTile,
  StatGrid,
  PageHero,
  DashboardCard,
  dashMeta,
} from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { computeInsights, computeWarnings } from "@/lib/insights"
import { computeDashboard, monthRange, txInRange, sumExpenses, getCategory } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { MOODS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const insightToneStyles = {
  danger: { card: "bg-[var(--dash-danger-soft)] ring-[var(--dash-danger-soft)]", icon: "bg-[var(--dash-surface)] text-[var(--dash-expense)]" },
  warning: { card: "bg-[var(--dash-warning-soft)] ring-[var(--dash-warning-soft)]", icon: "bg-[var(--dash-surface)] text-[#a85a20]" },
  positive: { card: "bg-[var(--dash-success-soft)] ring-[var(--dash-success-soft)]", icon: "bg-[var(--dash-surface)] text-[var(--dash-income)]" },
  neutral: { card: "bg-[var(--dash-accent-soft)]/60 ring-[var(--dash-accent-soft)]", icon: "bg-[var(--dash-surface)] text-[var(--dash-accent)]" },
}

export default function InsightsPage() {
  const { data } = useStore()
  const now = React.useMemo(() => new Date(), [])

  const insights = React.useMemo(() => computeInsights(data, now), [data, now])
  const warnings = React.useMemo(() => computeWarnings(data, now), [data, now])
  const metrics = React.useMemo(() => computeDashboard(data, now), [data, now])

  const categoryBreakdown = React.useMemo(() => {
    const month = monthRange(now)
    const monthExpenses = txInRange(data.transactions, month).filter((t) => t.type === "expense")
    const totalMonthExp = sumExpenses(monthExpenses)

    const map = new Map<string, { total: number; count: number }>()
    for (const t of monthExpenses) {
      const cur = map.get(t.categoryId) ?? { total: 0, count: 0 }
      cur.total += t.amount
      cur.count += 1
      map.set(t.categoryId, cur)
    }

    const items: Array<{
      categoryId: string
      category: ReturnType<typeof getCategory>
      total: number
      count: number
      pct: number
    }> = []

    for (const [catId, v] of map) {
      const cat = getCategory(data, catId)
      if (cat) {
        items.push({
          categoryId: catId,
          category: cat,
          total: v.total,
          count: v.count,
          pct: totalMonthExp > 0 ? (v.total / totalMonthExp) * 100 : 0,
        })
      }
    }
    return items.sort((a, b) => b.total - a.total)
  }, [data, now])

  const moodBreakdown = React.useMemo(() => {
    const month = monthRange(now)
    const monthExpenses = txInRange(data.transactions, month).filter((t) => t.type === "expense" && t.mood)
    const totalWithMood = sumExpenses(monthExpenses)

    const moodMap = new Map<string, { total: number; count: number }>()
    for (const t of monthExpenses) {
      if (!t.mood) continue
      const cur = moodMap.get(t.mood) ?? { total: 0, count: 0 }
      cur.total += t.amount
      cur.count += 1
      moodMap.set(t.mood, cur)
    }

    return MOODS.map((m) => {
      const v = moodMap.get(m.value) ?? { total: 0, count: 0 }
      return {
        ...m,
        total: v.total,
        count: v.count,
        pct: totalWithMood > 0 ? (v.total / totalWithMood) * 100 : 0,
      }
    }).sort((a, b) => b.total - a.total)
  }, [data, now])

  const cyclePct = metrics.cycleBudget > 0 ? (metrics.cycleSpending / metrics.cycleBudget) * 100 : 0
  const alertCount = warnings.length + insights.length

  return (
    <DashPage>
      <PageHeader
        title="Insights & analytics"
        description="Automated health checks, spending patterns, and smart recommendations for this cycle."
      />

      <PageHero
        label="Safe daily spending limit"
        value={formatMoney(metrics.safeDailyLimit, { symbol: data.settings.currencySymbol })}
        caption={
          <>
            <strong className="font-semibold text-[var(--dash-text)]">{metrics.daysRemaining} days</strong> left in
            this salary cycle with{" "}
            <strong className="font-semibold text-[var(--dash-text)]">
              {formatMoney(metrics.remainingSalary, { symbol: data.settings.currencySymbol })}
            </strong>{" "}
            remaining salary.
          </>
        }
      >
        <div className="max-w-xl space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--dash-text-secondary)]">
              Cycle spending · {formatMoney(metrics.cycleSpending, { symbol: data.settings.currencySymbol })}
            </span>
            <span className="font-semibold tabular-nums">{Math.round(cyclePct)}%</span>
          </div>
          <ProgressBar
            value={cyclePct}
            tone={metrics.remainingSalary <= 0 ? "danger" : metrics.safeDailyLimit < 200 ? "warning" : "accent"}
            className="h-2.5"
          />
          <p className="text-xs text-[var(--dash-text-muted)]">
            Cycle budget: {formatMoney(metrics.cycleBudget, { symbol: data.settings.currencySymbol })}
          </p>
        </div>
      </PageHero>

      <StatGrid>
        <StatTile
          icon="calendar-range"
          label="This month"
          value={formatMoney(metrics.monthSpending, { symbol: data.settings.currencySymbol, compact: true })}
        />
        <StatTile
          icon="sun"
          label="Today"
          value={formatMoney(metrics.todaySpending, { symbol: data.settings.currencySymbol, compact: true })}
        />
        <StatTile
          icon="hand-coins"
          label="Borrowed"
          value={formatMoney(metrics.borrowedOutstanding, { symbol: data.settings.currencySymbol, compact: true })}
          tone={metrics.borrowedOutstanding > 0 ? "danger" : "default"}
        />
        <StatTile
          icon="sparkles"
          label="Smart alerts"
          value={alertCount}
          tone={alertCount > 0 ? "warning" : "success"}
        />
      </StatGrid>

      <DashboardCard
        title="Smart financial alerts"
        description="Warnings and recommendations based on your recent activity"
        action={<span className={dashMeta}>{alertCount} active</span>}
      >
        {warnings.length === 0 && insights.length === 0 ? (
          <EmptyState
            icon="sparkles"
            title="Everything looks balanced"
            message="No critical warnings or unusual spending patterns detected right now."
            className="bg-transparent py-10"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {warnings.map((w) => {
              const tone = w.tone === "danger" ? "danger" : "warning"
              const styles = insightToneStyles[tone]
              return (
                <article
                  key={w.id}
                  className={cn("flex gap-3 rounded-xl p-4 ring-1", styles.card)}
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", styles.icon)}>
                    <Icon name={w.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-sm font-semibold text-[var(--dash-text)]">{w.title}</h4>
                    {w.detail ? <p className="text-xs leading-relaxed text-[var(--dash-text-secondary)]">{w.detail}</p> : null}
                  </div>
                </article>
              )
            })}

            {insights.map((ins) => {
              const tone =
                ins.tone === "positive"
                  ? "positive"
                  : ins.tone === "warning"
                    ? "warning"
                    : ins.tone === "danger"
                      ? "danger"
                      : "neutral"
              const styles = insightToneStyles[tone]

              return (
                <article
                  key={ins.id}
                  className={cn("flex gap-3 rounded-xl p-4 ring-1", styles.card)}
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", styles.icon)}>
                    <Icon name={ins.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-sm font-semibold text-[var(--dash-text)]">{ins.title}</h4>
                    {ins.detail ? (
                      <p className="text-xs leading-relaxed text-[var(--dash-text-secondary)]">{ins.detail}</p>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </DashboardCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard
          title="Category breakdown"
          description="Top spending categories this month"
          action={<span className={dashMeta}>This month</span>}
        >
          {categoryBreakdown.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--dash-text-muted)]">No expenses recorded this month.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {categoryBreakdown.slice(0, 6).map((item) => (
                <article
                  key={item.categoryId}
                  className="rounded-xl bg-[var(--dash-surface)] p-4 ring-1 ring-[var(--dash-border)] space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <CategoryBadge
                      icon={item.category?.icon ?? "circle"}
                      color={item.category?.color ?? "var(--muted)"}
                      name={item.category?.name}
                      size="sm"
                    />
                    <span className="rounded-md bg-[var(--dash-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--dash-text-muted)]">
                      {item.count} tx
                    </span>
                  </div>
                  <p className="font-mono text-xl font-bold tabular-nums text-[var(--dash-text)]">
                    {formatMoney(item.total, { symbol: data.settings.currencySymbol })}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--dash-text-muted)]">
                      <span>Share of spending</span>
                      <span className="font-semibold">{Math.round(item.pct)}%</span>
                    </div>
                    <ProgressBar value={item.pct} tone="accent" className="h-2" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Emotional spending"
          description="How you felt about purchases this month"
          action={<span className={dashMeta}>Mood tags</span>}
        >
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {moodBreakdown.map((m) => (
                <article
                  key={m.value}
                  className="rounded-xl bg-[var(--dash-surface)] p-4 ring-1 ring-[var(--dash-border)] space-y-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: m.color }}
                    >
                      <Icon name={m.icon} className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold capitalize text-[var(--dash-text)]">{m.label}</p>
                      <p className="text-xs text-[var(--dash-text-muted)]">{m.count} tagged purchases</p>
                    </div>
                  </div>
                  <p className="font-mono text-xl font-bold tabular-nums text-[var(--dash-text)]">
                    {formatMoney(m.total, { symbol: data.settings.currencySymbol })}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--dash-text-muted)]">
                      <span>Of mood-tagged spend</span>
                      <span className="font-semibold">{Math.round(m.pct)}%</span>
                    </div>
                    <ProgressBar value={m.pct} tone="accent" className="h-2" />
                  </div>
                </article>
              ))}
            </div>

            <div className="rounded-xl bg-[var(--dash-muted)] p-4 text-sm">
              <p className="font-semibold text-[var(--dash-text)]">Tip</p>
              <p className="mt-1 leading-relaxed text-[var(--dash-text-muted)]">
                Mood tags help surface impulse or regret spending so you can build more intentional habits over time.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashPage>
  )
}
