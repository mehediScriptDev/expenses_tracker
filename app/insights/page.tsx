"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader, EmptyState, ProgressBar, CategoryBadge } from "@/components/shared"
import { useStore } from "@/lib/store"
import { computeInsights, computeWarnings } from "@/lib/insights"
import { computeDashboard, monthRange, txInRange, sumExpenses, getCategory } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { MOODS } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function InsightsPage() {
  const { data } = useStore()
  const now = React.useMemo(() => new Date(), [])

  const insights = React.useMemo(() => computeInsights(data, now), [data, now])
  const warnings = React.useMemo(() => computeWarnings(data, now), [data, now])
  const metrics = React.useMemo(() => computeDashboard(data, now), [data, now])

  // Month expense category breakdown
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

    const items: Array<{ categoryId: string; category: ReturnType<typeof getCategory>; total: number; count: number; pct: number }> = []
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

  // Mood breakdown
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

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Insights & Analytics"
          description="Automated financial health checks, spending patterns, warnings, and smart recommendations."
        />

        {/* Pacing & Payday Pacing Header Card */}
        <Card className="border-border/60 bg-linear-to-br from-primary/5 via-background to-card shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon name="gauge" className="size-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Salary Pacing & Safe Limit
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {formatMoney(metrics.safeDailyLimit, { symbol: data.settings.currencySymbol })}
                  <span className="text-base font-normal text-muted-foreground"> / day safe limit</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  You have <strong className="text-foreground">{metrics.daysRemaining} days</strong> remaining in this salary cycle with{" "}
                  <strong className="text-foreground">{formatMoney(metrics.remainingSalary, { symbol: data.settings.currencySymbol })}</strong> remaining salary.
                </p>
              </div>

              <div className="space-y-2 sm:w-64">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Spent: {formatMoney(metrics.cycleSpending, { symbol: data.settings.currencySymbol })}</span>
                  <span className="font-semibold">{Math.round((metrics.cycleSpending / (metrics.cycleBudget || 1)) * 100)}%</span>
                </div>
                <ProgressBar
                  value={(metrics.cycleSpending / (metrics.cycleBudget || 1)) * 100}
                  tone={metrics.remainingSalary <= 0 ? "danger" : metrics.safeDailyLimit < 200 ? "warning" : "primary"}
                  className="h-3"
                />
                <p className="text-[11px] text-muted-foreground text-right">
                  Cycle budget: {formatMoney(metrics.cycleBudget, { symbol: data.settings.currencySymbol })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warnings & Smart Insights Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold tracking-tight">Smart Financial Alerts</h3>

          {warnings.length === 0 && insights.length === 0 ? (
            <EmptyState
              icon="sparkles"
              title="Everything looks balanced!"
              message="No critical warnings or budget spikes detected for your current spending history."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Warnings first */}
              {warnings.map((w) => {
                const isDanger = w.tone === "danger"
                return (
                  <Card
                    key={w.id}
                    className={`border-l-4 shadow-none ${
                      isDanger
                        ? "border-l-destructive bg-destructive/5"
                        : "border-l-warning bg-warning/5"
                    }`}
                  >
                    <CardContent className="p-4 flex gap-3">
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          isDanger ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"
                        }`}
                      >
                        <Icon name={w.icon} className="size-5" />
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{w.title}</h4>
                        {w.detail && <p className="text-xs text-muted-foreground">{w.detail}</p>}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {/* General Insights */}
              {insights.map((ins) => {
                const isPos = ins.tone === "positive"
                const isWarn = ins.tone === "warning"
                const isDang = ins.tone === "danger"

                return (
                  <Card
                    key={ins.id}
                    className={`border-l-4 shadow-none ${
                      isPos
                        ? "border-l-success bg-success/5"
                        : isWarn
                        ? "border-l-warning bg-warning/5"
                        : isDang
                        ? "border-l-destructive bg-destructive/5"
                        : "border-l-primary bg-primary/5"
                    }`}
                  >
                    <CardContent className="p-4 flex gap-3">
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          isPos
                            ? "bg-success/15 text-success"
                            : isWarn
                            ? "bg-warning/15 text-warning"
                            : isDang
                            ? "bg-destructive/15 text-destructive"
                            : "bg-primary/15 text-primary"
                        }`}
                      >
                        <Icon name={ins.icon} className="size-5" />
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{ins.title}</h4>
                        {ins.detail && <p className="text-xs text-muted-foreground">{ins.detail}</p>}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Spending Breakdown */}
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Category Breakdown (This Month)</CardTitle>
              <CardDescription>Top spending categories ranked by total spent amount.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryBreakdown.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">No expenses recorded this month.</p>
              ) : (
                categoryBreakdown.slice(0, 6).map((item) => (
                  <div key={item.categoryId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <CategoryBadge
                        icon={item.category?.icon ?? "circle"}
                        color={item.category?.color ?? "var(--muted)"}
                        name={item.category?.name}
                        size="sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{item.count} tx</span>
                        <span className="font-semibold">{formatMoney(item.total, { symbol: data.settings.currencySymbol })}</span>
                      </div>
                    </div>
                    <ProgressBar value={item.pct} className="h-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Emotional / Mood-Based Spending */}
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Emotional Spending Analysis</CardTitle>
              <CardDescription>How you felt about your purchases this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {moodBreakdown.map((m) => (
                <div key={m.value} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex size-6 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: m.color }}
                      >
                        <Icon name={m.icon} className="size-3.5" />
                      </span>
                      <span className="font-medium capitalize">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{Math.round(m.pct)}%</span>
                      <span className="font-semibold">{formatMoney(m.total, { symbol: data.settings.currencySymbol })}</span>
                    </div>
                  </div>
                  <ProgressBar value={m.pct} tone="primary" className="h-2" />
                </div>
              ))}

              <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">💡 Senior UX Tip</p>
                <p className="mt-0.5">
                  Tracking purchase mood helps identify impulse or regret spending so you can build conscious spending habits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
