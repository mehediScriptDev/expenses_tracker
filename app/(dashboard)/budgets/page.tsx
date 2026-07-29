"use client"

import * as React from "react"
import {
  PageHeader,
  EmptyState,
  ProgressBar,
  CategoryBadge,
  dashInput,
  DashPage,
  SummaryBar,
  PageHero,
  StatusBadge,
  DashboardCard,
} from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { computeBudgetUsage } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function BudgetsPage() {
  const { data, setBudget, removeBudget } = useStore()
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null)
  const [budgetInput, setBudgetInput] = React.useState<string>("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  const budgetUsages = React.useMemo(() => computeBudgetUsage(data), [data])

  const totalBudgeted = React.useMemo(
    () => budgetUsages.reduce((sum, b) => sum + b.budget, 0),
    [budgetUsages],
  )
  const totalSpent = React.useMemo(
    () => budgetUsages.reduce((sum, b) => sum + b.spent, 0),
    [budgetUsages],
  )
  const totalRemaining = totalBudgeted - totalSpent
  const overallPct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0
  const overCount = budgetUsages.filter((b) => b.over).length
  const warningCount = budgetUsages.filter((b) => !b.over && b.pct >= 85).length

  const unbudgetedCategories = React.useMemo(() => {
    const budgetedIds = new Set(Object.keys(data.budgets))
    return data.categories.filter((c) => c.kind === "expense" && !budgetedIds.has(c.id))
  }, [data.categories, data.budgets])

  const handleSaveBudget = (catId: string) => {
    const val = parseFloat(budgetInput)
    if (!isNaN(val) && val >= 0) {
      if (val === 0) removeBudget(catId)
      else setBudget(catId, val)
    }
    setEditingCatId(null)
    setBudgetInput("")
  }

  return (
    <DashPage>
      <PageHeader title="Budgets" description="Set monthly limits and track spending against each category.">
        {unbudgetedCategories.length > 0 ? (
          <Button variant="dash" onClick={() => setIsAddOpen(true)} className="h-11 w-full gap-1.5 px-5 sm:w-auto">
            <Icon name="plus" className="size-4" />
            Set budget
          </Button>
        ) : null}
      </PageHeader>

      <PageHero
        label="Monthly budget overview"
        value={formatMoney(totalBudgeted, { symbol: data.settings.currencySymbol })}
        caption={
          <>
            <strong className="font-semibold text-(--dash-text)">
              {formatMoney(totalSpent, { symbol: data.settings.currencySymbol })}
            </strong>{" "}
            spent this month ·{" "}
            <strong
              className={cn(
                "font-semibold",
                totalRemaining < 0 ? "text-destructive" : "text-success",
              )}
            >
              {totalRemaining < 0
                ? `${formatMoney(Math.abs(totalRemaining), { symbol: data.settings.currencySymbol })} over`
                : `${formatMoney(totalRemaining, { symbol: data.settings.currencySymbol })} remaining`}
            </strong>
          </>
        }
      >
        <div className="max-w-xl space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--dash-text-secondary)]">Overall usage</span>
            <span className="font-semibold tabular-nums text-(--dash-text)">{Math.round(overallPct)}%</span>
          </div>
          <ProgressBar
            value={overallPct}
            tone={overallPct > 100 ? "danger" : overallPct >= 85 ? "warning" : "accent"}
            className="h-2.5"
          />
        </div>
      </PageHero>

      {budgetUsages.length > 0 ? (
        <SummaryBar
          items={[
            { label: "Active", value: budgetUsages.length },
            {
              label: "On track",
              value: budgetUsages.length - overCount - warningCount,
              tone: "success",
            },
            {
              label: "Near limit",
              value: warningCount,
              tone: warningCount > 0 ? "warning" : "default",
            },
            {
              label: "Over",
              value: overCount,
              tone: overCount > 0 ? "danger" : "default",
            },
          ]}
        />
      ) : null}

      {budgetUsages.length === 0 ? (
        <EmptyState
          icon="target"
          title="No budgets yet"
          message="Assign a monthly spending cap to any expense category and track progress in real time."
          action={
            unbudgetedCategories.length > 0 ? (
              <Button variant="dash" onClick={() => setIsAddOpen(true)}>
                Set your first budget
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgetUsages.map((u) => {
            const tone = u.over ? "danger" : u.pct >= 85 ? "warning" : "success"
            const isEditing = editingCatId === u.category.id
            const statusLabel = u.over ? "Over budget" : u.pct >= 85 ? "Near limit" : "On track"
            const statusTone = u.over ? "danger" : u.pct >= 85 ? "warning" : "success"

            return (
              <DashboardCard
                key={u.category.id}
                title=""
                description={`${Math.round(u.pct)}% of monthly limit used`}
                action={
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-[var(--dash-text-muted)] hover:text-(--dash-text)"
                      onClick={() => {
                        setEditingCatId(u.category.id)
                        setBudgetInput(String(u.budget))
                      }}
                      aria-label={`Edit ${u.category.name} budget`}
                    >
                      <Icon name="pencil" className="size-3.5" />
                    </Button>
                  </div>
                }
                bodyClassName="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <CategoryBadge icon={u.category.icon} color={u.category.color} name={u.category.name} size="md" />
                </div>

                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="Amount"
                      className={cn(dashInput, "h-10 min-w-0 flex-1 text-sm")}
                      autoFocus
                    />
                    <Button variant="dash" size="sm" className="h-10 px-4" onClick={() => handleSaveBudget(u.category.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-10" onClick={() => setEditingCatId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)]">
                          Spent
                        </p>
                        <p className="mt-1 font-mono text-xl font-bold tabular-nums text-(--dash-text)">
                          {formatMoney(u.spent, { symbol: data.settings.currencySymbol })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)]">
                          Limit
                        </p>
                        <p className="mt-1 font-mono text-lg font-bold tabular-nums text-[var(--dash-text-secondary)]">
                          {formatMoney(u.budget, { symbol: data.settings.currencySymbol })}
                        </p>
                      </div>
                    </div>
                    <ProgressBar value={u.pct} tone={tone} className="h-2.5" />
                    <p className="text-xs text-[var(--dash-text-muted)]">
                      {u.over
                        ? `${formatMoney(u.spent - u.budget, { symbol: data.settings.currencySymbol })} above limit`
                        : `${formatMoney(u.budget - u.spent, { symbol: data.settings.currencySymbol })} left this month`}
                    </p>
                  </>
                )}
              </DashboardCard>
            )
          })}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set category budget</DialogTitle>
            <DialogDescription>Choose a category and set its monthly spending limit.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const target = e.currentTarget
              const catId = (target.elements.namedItem("catId") as HTMLSelectElement).value
              const amt = parseFloat((target.elements.namedItem("amount") as HTMLInputElement).value)
              if (catId && !isNaN(amt) && amt > 0) {
                setBudget(catId, amt)
                setIsAddOpen(false)
              }
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-1.5">
              <label className="dash-label">Category</label>
              <select
                name="catId"
                className="dash-input w-full px-3 text-sm"
              >
                {unbudgetedCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="dash-label">Monthly limit</label>
              <Input name="amount" type="number" placeholder="5000" className={dashInput} required />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button variant="dash" type="submit">
                Save budget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashPage>
  )
}
