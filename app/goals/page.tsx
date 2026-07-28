"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader, EmptyState, ProgressBar } from "@/components/shared"
import { useStore } from "@/lib/store"
import { formatMoney, relativeDay, todayISO } from "@/lib/format"
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
import { toast } from "sonner"

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
    color: "var(--chart-1)",
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
  const completedCount = React.useMemo(() => goals.filter((g) => g.currentAmount >= g.targetAmount).length, [goals])

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
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Savings Goals"
          description="Set financial targets, automate savings habits, and reach your milestones faster."
        >
          <Button onClick={handleOpenAdd} className="gap-1.5">
            <Icon name="plus" className="size-4" />
            Add New Goal
          </Button>
        </PageHeader>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Active Goals</p>
              <p className="mt-1 text-xl font-bold">{goals.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Saved</p>
              <p className="mt-1 text-xl font-bold text-success">
                {formatMoney(totalSaved, { symbol: data.settings.currencySymbol })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Target</p>
              <p className="mt-1 text-xl font-bold">
                {formatMoney(totalTarget, { symbol: data.settings.currencySymbol })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Goals Completed</p>
              <p className="mt-1 text-xl font-bold text-primary">
                🏆 {completedCount} / {goals.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <EmptyState
            icon="trophy"
            title="No savings goals created"
            message="Create your first financial target for an emergency fund, travel, or big purchase."
            action={<Button onClick={handleOpenAdd}>Create Savings Goal</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((g) => {
              const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
              const isCompleted = pct >= 100
              const remaining = Math.max(0, g.targetAmount - g.currentAmount)

              return (
                <Card key={g.id} className="border-border/60 shadow-none relative overflow-hidden">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-success text-success-foreground text-[10px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
                      <Icon name="trophy" className="size-3" />
                      Completed!
                    </div>
                  )}

                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                        style={{ backgroundColor: g.color }}
                      >
                        <Icon name={g.icon || "piggy-bank"} className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold truncate">{g.title}</h3>
                        {g.targetDate && (
                          <p className="text-xs text-muted-foreground">
                            Target Date: {relativeDay(g.targetDate)} ({g.targetDate})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-muted-foreground">
                          Saved: <strong className="text-foreground">{formatMoney(g.currentAmount, { symbol: data.settings.currencySymbol })}</strong>
                        </span>
                        <span className="font-semibold">{formatMoney(g.targetAmount, { symbol: data.settings.currencySymbol })}</span>
                      </div>

                      <ProgressBar value={pct} tone={isCompleted ? "success" : "primary"} className="h-2.5" />

                      <div className="flex justify-between text-xs text-muted-foreground pt-0.5">
                        <span className={`font-semibold ${isCompleted ? "text-success" : "text-foreground"}`}>
                          {Math.round(pct)}% reached
                        </span>
                        <span>{isCompleted ? "Target Achieved 🎉" : `${formatMoney(remaining, { symbol: data.settings.currencySymbol })} remaining`}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        className="flex-1 text-xs gap-1.5 h-8"
                        onClick={() => handleOpenDeposit(g)}
                      >
                        <Icon name="plus" className="size-3.5" />
                        Deposit / Save
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteGoal(g.id)}
                      >
                        <Icon name="trash-2" className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Create Goal Dialog */}
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

        {/* Deposit Modal */}
        <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit into {targetGoal?.title}</DialogTitle>
              <DialogDescription>
                Add money saved towards this goal. (Use negative value to withdraw).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveDeposit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Deposit Amount ({data.settings.currencySymbol})
                </label>
                <Input
                  type="number"
                  step="any"
                  value={depositAmt}
                  onChange={(e) => setDepositAmt(e.target.value)}
                  placeholder="e.g. 5000"
                  required
                  autoFocus
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setDepositModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Deposit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
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
  const [color, setColor] = React.useState("var(--chart-1)")

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
      setColor("var(--chart-1)")
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
          <DialogTitle>{editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}</DialogTitle>
          <DialogDescription>
            Define target amount, initial savings, and target completion date.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Goal Title</label>
            <Input
              placeholder="e.g. Emergency Fund, New Smartphone, Tour"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Target Amount ({currencySymbol})</label>
              <Input
                type="number"
                step="any"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Initial Saved ({currencySymbol})</label>
              <Input
                type="number"
                step="any"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Target Date (Optional)</label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingGoal ? "Save Changes" : "Create Goal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
