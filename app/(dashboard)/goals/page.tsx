"use client"

import * as React from "react"
import {
  PageHeader,
  EmptyState,
  ProgressBar,
  DashPage,
  SummaryBar,
  PageHero,
  StatusBadge,
  DashboardCard,
  dashInput,
} from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { formatMoney, relativeDay } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  targetDate?: string
  icon: string
  color: string
  createdAt: number
}

const STORAGE_GOALS_KEY = "finbuddy:goals:v1"

const DEFAULT_GOALS: Goal[] = [
  {
    id: "g_1",
    title: "Emergency Safety Reserve",
    targetAmount: 50000,
    currentAmount: 32000,
    targetDate: "2026-12-31",
    icon: "piggy-bank",
    color: "var(--chart-4)",
    createdAt: Date.now() - 30 * 86400000,
  },
  {
    id: "g_2",
    title: "Laptop Upgrade Fund",
    targetAmount: 85000,
    currentAmount: 45000,
    targetDate: "2026-10-15",
    icon: "laptop",
    color: "var(--chart-2)",
    createdAt: Date.now() - 15 * 86400000,
  },
  {
    id: "g_3",
    title: "Family Vacation Trip",
    targetAmount: 25000,
    currentAmount: 25000,
    targetDate: "2026-08-10",
    icon: "plane",
    color: "var(--chart-3)",
    createdAt: Date.now() - 60 * 86400000,
  },
]

export default function GoalsPage() {
  const { data } = useStore()
  const [goals, setGoals] = React.useState<Goal[]>(() => {
    if (typeof window === "undefined") return DEFAULT_GOALS
    try {
      const raw = window.localStorage.getItem(STORAGE_GOALS_KEY)
      return raw ? JSON.parse(raw) : DEFAULT_GOALS
    } catch {
      return DEFAULT_GOALS
    }
  })

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_GOALS_KEY, JSON.stringify(goals))
    } catch {}
  }, [goals])

  const [addModalOpen, setAddModalOpen] = React.useState(false)
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null)

  const [depositModalOpen, setDepositModalOpen] = React.useState(false)
  const [targetGoal, setTargetGoal] = React.useState<Goal | null>(null)
  const [depositAmt, setDepositAmt] = React.useState("")

  const totalTarget = React.useMemo(() => goals.reduce((s, g) => s + g.targetAmount, 0), [goals])
  const totalSaved = React.useMemo(() => goals.reduce((s, g) => s + g.currentAmount, 0), [goals])
  const completedCount = React.useMemo(
    () => goals.filter((g) => g.currentAmount >= g.targetAmount).length,
    [goals],
  )
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  const handleOpenAdd = () => {
    setEditingGoal(null)
    setAddModalOpen(true)
  }

  const handleOpenDeposit = (g: Goal) => {
    setTargetGoal(g)
    setDepositAmt("")
    setDepositModalOpen(true)
  }

  const handleSaveDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetGoal) return
    const add = parseFloat(depositAmt)
    if (!isNaN(add) && add !== 0) {
      setGoals((prev) =>
        prev.map((g) => (g.id === targetGoal.id ? { ...g, currentAmount: Math.max(0, g.currentAmount + add) } : g)),
      )
      toast.success(`Updated savings for ${targetGoal.title}`)
    }
    setDepositModalOpen(false)
  }

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    toast.success("Goal deleted")
  }

  return (
    <DashPage>
      <PageHeader
        title="Savings goals"
        description="Set targets, track progress, and build toward what matters most."
      >
        <Button variant="dash" onClick={handleOpenAdd} className="h-11 w-full gap-1.5 px-5 sm:w-auto">
          <Icon name="plus" className="size-4" />
          Add goal
        </Button>
      </PageHeader>

      <PageHero
        label="Total saved toward goals"
        value={formatMoney(totalSaved, { symbol: data.settings.currencySymbol })}
        caption={
          <>
            Target across all goals:{" "}
            <strong className="font-semibold text-(--dash-text)">
              {formatMoney(totalTarget, { symbol: data.settings.currencySymbol })}
            </strong>{" "}
            · {completedCount} of {goals.length} completed
          </>
        }
      >
        <div className="max-w-xl space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--dash-text-secondary)]">Overall progress</span>
            <span className="font-semibold tabular-nums">{Math.round(overallPct)}%</span>
          </div>
          <ProgressBar value={overallPct} tone={overallPct >= 100 ? "success" : "accent"} className="h-2.5" />
        </div>
      </PageHero>

      <SummaryBar
        items={[
          { label: "Goals", value: goals.length },
          {
            label: "Saved",
            value: formatMoney(totalSaved, { symbol: data.settings.currencySymbol, compact: true }),
            tone: "success",
          },
          {
            label: "Target",
            value: formatMoney(totalTarget, { symbol: data.settings.currencySymbol, compact: true }),
          },
          {
            label: "Completed",
            value: `${completedCount}/${goals.length}`,
            tone: completedCount > 0 ? "accent" : "default",
          },
        ]}
      />

      {goals.length === 0 ? (
        <EmptyState
          icon="trophy"
          title="No savings goals yet"
          message="Create a target for an emergency fund, travel, or a major purchase."
          action={<Button variant="dash" onClick={handleOpenAdd}>Create savings goal</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => {
            const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
            const isCompleted = pct >= 100
            const remaining = Math.max(0, g.targetAmount - g.currentAmount)

            return (
              <DashboardCard
                key={g.id}
                title={g.title}
                description={
                  g.targetDate
                    ? `Target ${relativeDay(g.targetDate)} · ${g.targetDate}`
                    : "No target date set"
                }
                action={
                  isCompleted ? (
                    <StatusBadge tone="success" icon="trophy">
                      Completed
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="accent">{Math.round(pct)}%</StatusBadge>
                  )
                }
                bodyClassName="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: g.color }}
                  >
                    <Icon name={g.icon || "piggy-bank"} className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Saved
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
                          {formatMoney(g.currentAmount, { symbol: data.settings.currencySymbol })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Target
                        </p>
                        <p className="mt-1 font-mono text-base font-bold tabular-nums text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {formatMoney(g.targetAmount, { symbol: data.settings.currencySymbol })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <ProgressBar value={pct} tone={isCompleted ? "success" : "accent"} className="h-3" />

                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {isCompleted ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      Target achieved — great work!
                    </span>
                  ) : (
                    <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      {formatMoney(remaining, { symbol: data.settings.currencySymbol })} remaining
                    </span>
                  )}
                </p>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="dash"
                    size="sm"
                    className="h-9 flex-1 gap-1.5 text-xs"
                    onClick={() => handleOpenDeposit(g)}
                  >
                    <Icon name="plus" className="size-3.5" />
                    Deposit / save
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 text-[var(--dash-text-muted)] hover:text-destructive"
                    onClick={() => handleDeleteGoal(g.id)}
                    aria-label={`Delete ${g.title}`}
                  >
                    <Icon name="trash-2" className="size-4" />
                  </Button>
                </div>
              </DashboardCard>
            )
          })}
        </div>
      )}

      <GoalDialog
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        editingGoal={editingGoal}
        currencySymbol={data.settings.currencySymbol}
        onSave={(goalData) => {
          if (editingGoal) {
            setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? { ...g, ...goalData } : g)))
          } else {
            setGoals((prev) => [{ ...goalData, id: `g_${Date.now()}`, createdAt: Date.now() }, ...prev])
          }
          setAddModalOpen(false)
          toast.success("Goal saved successfully!")
        }}
      />

      <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit into {targetGoal?.title}</DialogTitle>
            <DialogDescription>Add savings toward this goal. Use a negative value to withdraw.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDeposit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="dash-label">Amount ({data.settings.currencySymbol})</label>
              <Input
                type="number"
                step="any"
                value={depositAmt}
                onChange={(e) => setDepositAmt(e.target.value)}
                placeholder="e.g. 5000"
                className={dashInput}
                required
                autoFocus
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDepositModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="dash" type="submit">
                Save deposit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashPage>
  )
}

function GoalDialog({
  open,
  onOpenChange,
  editingGoal,
  currencySymbol,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingGoal: Goal | null
  currencySymbol: string
  onSave: (goal: Omit<Goal, "id" | "createdAt">) => void
}) {
  const [title, setTitle] = React.useState("")
  const [targetAmount, setTargetAmount] = React.useState("")
  const [currentAmount, setCurrentAmount] = React.useState("0")
  const [targetDate, setTargetDate] = React.useState("")
  const [icon, setIcon] = React.useState("piggy-bank")
  const [color, setColor] = React.useState("var(--chart-4)")

  React.useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title)
      setTargetAmount(String(editingGoal.targetAmount))
      setCurrentAmount(String(editingGoal.currentAmount))
      setTargetDate(editingGoal.targetDate || "")
      setIcon(editingGoal.icon)
      setColor(editingGoal.color)
    } else {
      setTitle("")
      setTargetAmount("10000")
      setCurrentAmount("0")
      setTargetDate("")
      setIcon("piggy-bank")
      setColor("var(--chart-4)")
    }
  }, [editingGoal, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetNum = parseFloat(targetAmount)
    const currentNum = parseFloat(currentAmount) || 0
    if (!title.trim() || isNaN(targetNum) || targetNum <= 0) return

    onSave({
      title: title.trim(),
      targetAmount: targetNum,
      currentAmount: currentNum,
      targetDate: targetDate || undefined,
      icon,
      color,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingGoal ? "Edit savings goal" : "Create savings goal"}</DialogTitle>
          <DialogDescription>Define target amount, starting balance, and optional deadline.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="dash-label">Goal title</label>
            <Input
              placeholder="e.g. Emergency fund, New phone, Tour"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={dashInput}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="dash-label">Target ({currencySymbol})</label>
              <Input
                type="number"
                step="any"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className={dashInput}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="dash-label">Starting saved ({currencySymbol})</label>
              <Input
                type="number"
                step="any"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className={dashInput}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Target date (optional)</label>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className={dashInput} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="dash" type="submit">
              {editingGoal ? "Save changes" : "Create goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
