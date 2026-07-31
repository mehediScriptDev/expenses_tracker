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
  Pagination,
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

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(6)

  const budgetUsages = React.useMemo(() => computeBudgetUsage(data), [data])

  const totalPages = Math.ceil(budgetUsages.length / pageSize) || 1

  const paginatedUsages = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return budgetUsages.slice(start, start + pageSize)
  }, [budgetUsages, currentPage, pageSize])

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

  const stats = [
    {
      label: "Total Budgeted",
      value: formatMoney(totalBudgeted, { symbol: data.settings.currencySymbol }),
      icon: "piggy-bank",
      cardBg: "bg-[#FFF8D6] dark:bg-[#332A00]",
      textColor: "text-[#5C4500] dark:text-[#FFE999]",
      iconBg: "bg-[#FFE885] text-[#423200] dark:bg-[#524200] dark:text-[#FFE999]",
      labelColor: "text-[#7A5C00] dark:text-[#FFDF80]",
    },
    {
      label: "Total Spent",
      value: formatMoney(totalSpent, { symbol: data.settings.currencySymbol }),
      icon: "shopping-bag",
      cardBg: "bg-[#FDF0E9] dark:bg-[#381B0E]",
      textColor: "text-[#6E2E10] dark:text-[#FCD5C5]",
      iconBg: "bg-[#FCD8C5] text-[#52200A] dark:bg-[#5C2A15] dark:text-[#FCD5C5]",
      labelColor: "text-[#8C3D18] dark:text-[#FBBFA8]",
    },
    {
      label: totalRemaining < 0 ? "Over Budget" : "Remaining",
      value: formatMoney(Math.abs(totalRemaining), { symbol: data.settings.currencySymbol }),
      icon: totalRemaining < 0 ? "alert-circle" : "wallet",
      cardBg: totalRemaining < 0 ? "bg-[#FEE2E2] dark:bg-[#451212]" : "bg-[#EBF7EE] dark:bg-[#0B2E17]",
      textColor: totalRemaining < 0 ? "text-[#991B1B] dark:text-[#FCA5A5]" : "text-[#134D25] dark:text-[#C1F0CC]",
      iconBg: totalRemaining < 0 ? "bg-[#FCA5A5] text-[#7F1D1D] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]" : "bg-[#C4EAD0] text-[#0C3B1B] dark:bg-[#194D27] dark:text-[#C1F0CC]",
      labelColor: totalRemaining < 0 ? "text-[#B91C1C] dark:text-[#FCA5A5]" : "text-[#196631] dark:text-[#9EE5AF]",
    },
    {
      label: "Budget Status",
      value: budgetUsages.length > 0 ? `${budgetUsages.length - overCount - warningCount}/${budgetUsages.length} On Track` : "0 Budgets",
      icon: "target",
      cardBg: "bg-[#EEF4FF] dark:bg-[#102347]",
      textColor: "text-[#163870] dark:text-[#C7DBFF]",
      iconBg: "bg-[#CFE1FF] text-[#0E2854] dark:bg-[#1E3B6E] dark:text-[#C7DBFF]",
      labelColor: "text-[#1E4A94] dark:text-[#A8C7FF]",
    },
  ]

  return (
    <DashPage>
      <PageHeader title="Budgets" description="Set monthly limits and track spending against each category." />

      <section className="rounded-xl bg-white dark:bg-card p-5 sm:p-7 border border-neutral-200/60 dark:border-neutral-800 shadow-2xs space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2 max-w-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Overall budget usage
              </span>
              <span className="text-sm font-extrabold tabular-nums text-neutral-900 dark:text-neutral-100">
                {Math.round(overallPct)}%
              </span>
            </div>
            <ProgressBar
              value={overallPct}
              tone={overallPct > 100 ? "danger" : overallPct >= 85 ? "warning" : "accent"}
              className="h-3"
            />
          </div>

          {unbudgetedCategories.length > 0 ? (
            <Button
              onClick={() => setIsAddOpen(true)}
              className="h-10 px-5 gap-1.5 shadow-2xs shrink-0 font-semibold"
            >
              <Icon name="plus" className="size-4" />
              Set budget
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 min-w-0 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "min-w-0 overflow-hidden rounded-xl p-3.5 sm:p-4.5 transition-transform hover:-translate-y-0.5 border border-black/5 dark:border-white/5 shadow-2xs",
                stat.cardBg,
              )}
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl sm:size-9", stat.iconBg)}>
                  <Icon name={stat.icon} className="size-4 sm:size-4.5" aria-hidden />
                </span>
                <p className={cn("min-w-0 flex-1 truncate text-xs font-black uppercase tracking-wider", stat.labelColor)}>
                  {stat.label}
                </p>
              </div>
              <p className={cn("mt-2.5 truncate font-mono text-xl font-black tabular-nums tracking-tight sm:mt-3 sm:text-2xl", stat.textColor)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

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
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedUsages.map((u) => {
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
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(u.category.id)
                          setBudgetInput(String(u.budget))
                        }}
                        aria-label={`Edit ${u.category.name} budget`}
                        className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-500 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-black dark:hover:border-neutral-100 transition-all cursor-pointer"
                      >
                        <Icon name="pencil" className="size-3.5" />
                      </button>
                    </div>
                  }
                  bodyClassName="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <CategoryBadge icon={u.category.icon} color={u.category.color} name={u.category.name} size="md" />
                  </div>

                  {isEditing ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        placeholder="Amount"
                        className={cn("h-11 min-w-0 flex-1 text-sm", dashInput)}
                        autoFocus
                      />
                      <Button variant="dash" size="sm" className="h-11 px-4" onClick={() => handleSaveBudget(u.category.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" className="h-11 px-3" onClick={() => setEditingCatId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Spent
                          </p>
                          <p className="mt-1 font-mono text-xl font-black tabular-nums text-slate-900 dark:text-slate-50">
                            {formatMoney(u.spent, { symbol: data.settings.currencySymbol })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Limit
                          </p>
                          <p className="mt-1 font-mono text-base font-bold tabular-nums text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                            {formatMoney(u.budget, { symbol: data.settings.currencySymbol })}
                          </p>
                        </div>
                      </div>
                      <ProgressBar value={u.pct} tone={tone} className="h-3" />
                      <div className="flex items-center justify-between text-xs font-semibold">
                        {u.over ? (
                          <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                            {formatMoney(u.spent - u.budget, { symbol: data.settings.currencySymbol })} above limit
                          </span>
                        ) : (
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            {formatMoney(u.budget - u.spent, { symbol: data.settings.currencySymbol })} left this month
                          </span>
                        )}
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          {Math.round(u.pct)}%
                        </span>
                      </div>
                    </>
                  )}
                </DashboardCard>
              )
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={budgetUsages.length}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[6, 12, 24, 48]}
          />
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
