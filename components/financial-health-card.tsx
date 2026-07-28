"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { computeDashboard, computeBudgetUsage, monthRange, txInRange, sumExpenses, sumIncome } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { Card, CardContent } from "@/components/ui/card"

export function FinancialHealthCard() {
  const { data } = useStore()
  const now = React.useMemo(() => new Date(), [])
  const metrics = React.useMemo(() => computeDashboard(data, now), [data, now])
  const budgetUsages = React.useMemo(() => computeBudgetUsage(data, now), [data, now])

  // 1. Savings Rate score (30 pts)
  const month = monthRange(now)
  const monthTxs = txInRange(data.transactions, month)
  const monthInc = sumIncome(monthTxs) || data.settings.salary || 1
  const monthExp = sumExpenses(monthTxs)
  const netSaved = Math.max(0, monthInc - monthExp)
  const savingsPct = (netSaved / monthInc) * 100
  let savingsScore = 0
  if (savingsPct >= 25) savingsScore = 30
  else if (savingsPct >= 15) savingsScore = 24
  else if (savingsPct >= 10) savingsScore = 18
  else if (savingsPct >= 5) savingsScore = 10

  // 2. Budget Compliance (30 pts)
  let budgetScore = 30
  if (budgetUsages.length > 0) {
    const overCount = budgetUsages.filter((b) => b.over).length
    budgetScore = Math.max(0, Math.round(((budgetUsages.length - overCount) / budgetUsages.length) * 30))
  }

  // 3. Pacing Safety (20 pts)
  let pacingScore = 20
  if (metrics.remainingSalary <= 0 && metrics.daysRemaining > 0) pacingScore = 0
  else if (metrics.safeDailyLimit < 150) pacingScore = 10

  // 4. Debt Safety (20 pts)
  const debtRatio = monthInc > 0 ? (metrics.borrowedOutstanding / monthInc) * 100 : 0
  let debtScore = 20
  if (debtRatio > 50) debtScore = 0
  else if (debtRatio > 25) debtScore = 8
  else if (debtRatio > 10) debtScore = 14

  const totalScore = Math.min(100, Math.max(0, savingsScore + budgetScore + pacingScore + debtScore))

  const grade =
    totalScore >= 90
      ? { label: "Financial Champion", badge: "A+", tone: "text-success bg-success/10 border-success/30" }
      : totalScore >= 75
      ? { label: "Healthy & Balanced", badge: "B+", tone: "text-primary bg-primary/10 border-primary/30" }
      : totalScore >= 60
      ? { label: "Moderate Caution", badge: "C", tone: "text-warning bg-warning/10 border-warning/30" }
      : { label: "Needs Restructuring", badge: "D", tone: "text-destructive bg-destructive/10 border-destructive/30" }

  // Calculate tracking streak (consecutive unique transaction dates)
  const streakDays = React.useMemo(() => {
    const dates = Array.from(new Set(data.transactions.map((t) => t.date))).sort().reverse()
    if (dates.length === 0) return 0
    return dates.length
  }, [data.transactions])

  return (
    <Card className="border-border/60 shadow-none bg-gradient-to-br from-card to-muted/20">
      <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Score & Badge */}
        <div className="flex items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-background border border-border shadow-inner font-mono">
            <div className="text-center">
              <span className="text-2xl font-black tracking-tight">{totalScore}</span>
              <span className="block text-[9px] text-muted-foreground uppercase font-bold">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${grade.tone}`}>
                {grade.badge}
              </span>
              <span className="text-sm font-semibold">{grade.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Savings Rate: <strong className="text-foreground">{Math.round(savingsPct)}%</strong> · Pacing:{" "}
              <strong className="text-foreground">{formatMoney(metrics.safeDailyLimit, { symbol: data.settings.currencySymbol })}/day</strong>
            </p>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2 text-orange-600 dark:text-orange-400">
          <Icon name="flame" className="size-5 animate-pulse" />
          <div>
            <p className="text-xs font-bold">{streakDays} Day Streak!</p>
            <p className="text-[10px] opacity-80">Consistent tracking</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
