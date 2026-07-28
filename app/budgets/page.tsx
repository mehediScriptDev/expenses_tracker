"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader, EmptyState, ProgressBar, CategoryBadge } from "@/components/shared"
import { useStore } from "@/lib/store"
import { computeBudgetUsage } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6 py-2">
        <PageHeader
          title="Budgets"
          description="Monthly category spending limits."
        >
          {unbudgetedCategories.length > 0 && (
            <Button onClick={() => setIsAddOpen(true)} className="gap-1.5 rounded-full px-5">
              <Icon name="plus" className="size-4" />
              Set Budget
            </Button>
          )}
        </PageHeader>

        {/* Clean Overview Card */}
        <div className="rounded-3xl border border-border/50 bg-card p-6 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly Budget Total</p>
            <p className="mt-1 font-mono text-3xl font-bold text-foreground">
              {formatMoney(totalBudgeted, { symbol: data.settings.currencySymbol })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Spent: {formatMoney(totalSpent, { symbol: data.settings.currencySymbol })}</p>
            <p className={`mt-1 font-mono text-sm font-semibold ${totalRemaining < 0 ? "text-destructive" : "text-success"}`}>
              {totalRemaining < 0 ? `${formatMoney(Math.abs(totalRemaining), { symbol: data.settings.currencySymbol })} over` : `${formatMoney(totalRemaining, { symbol: data.settings.currencySymbol })} left`}
            </p>
          </div>
        </div>

        {/* Budget Cards List */}
        {budgetUsages.length === 0 ? (
          <EmptyState
            icon="target"
            title="No budgets configured"
            message="Set a monthly budget for any expense category."
            action={
              unbudgetedCategories.length > 0 ? (
                <Button onClick={() => setIsAddOpen(true)}>Set Your First Budget</Button>
              ) : null
            }
          />
        ) : (
          <div className="space-y-3">
            {budgetUsages.map((u) => {
              const tone = u.over ? "danger" : u.pct >= 85 ? "warning" : "success"
              const isEditing = editingCatId === u.category.id

              return (
                <Card key={u.category.id} className="border-border/50 shadow-none rounded-2xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <CategoryBadge
                        icon={u.category.icon}
                        color={u.category.color}
                        name={u.category.name}
                        size="sm"
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingCatId(u.category.id)
                          setBudgetInput(String(u.budget))
                        }}
                      >
                        <Icon name="pencil" className="size-3.5" />
                      </Button>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2 pt-1">
                        <Input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          placeholder="Amount"
                          className="h-8 text-xs"
                          autoFocus
                        />
                        <Button size="sm" className="h-8 px-3 text-xs" onClick={() => handleSaveBudget(u.category.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditingCatId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Spent: {formatMoney(u.spent, { symbol: data.settings.currencySymbol })}</span>
                          <span className="font-semibold text-foreground">Limit: {formatMoney(u.budget, { symbol: data.settings.currencySymbol })}</span>
                        </div>
                        <ProgressBar value={u.pct} tone={tone} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Modal for setting new budget */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Category Budget</DialogTitle>
              <DialogDescription>Select category and monthly limit.</DialogDescription>
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
                <label className="text-xs font-medium text-foreground">Category</label>
                <select
                  name="catId"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  {unbudgetedCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Monthly Limit</label>
                <Input name="amount" type="number" placeholder="5000" required />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Budget</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
