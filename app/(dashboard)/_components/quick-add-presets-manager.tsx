"use client"

import * as React from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Icon } from "@/lib/icon"
import { formatMoney } from "@/lib/format"
import { PAYMENT_METHODS, QUICK_ADD_ICON_CHOICES } from "@/lib/constants"
import type { QuickAddPreset, PaymentMethod } from "@/types"
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
import { dashCaption, dashInput, dashLabel, dashLink, dashMuted } from "@/dashboard/shared"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function QuickAddPresetsManager({ compact = false }: { compact?: boolean }) {
  const { data, addQuickAddPreset, updateQuickAddPreset, deleteQuickAddPreset } = useStore()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<QuickAddPreset | null>(null)

  const expenseCategories = data.categories.filter((c) => c.kind === "expense")

  const openAdd = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (preset: QuickAddPreset) => {
    setEditing(preset)
    setDialogOpen(true)
  }

  const handleDelete = (preset: QuickAddPreset) => {
    deleteQuickAddPreset(preset.id)
    toast.success(`Removed "${preset.label}"`)
  }

  if (compact) {
    return (
      <Link href="/settings#quick-add-presets" className={dashLink}>
        Customize
      </Link>
    )
  }

  return (
    <div id="quick-add-presets" className="scroll-mt-24 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-(--dash-text)">Quick add presets</h3>
          <p className={cn(dashCaption, "mt-1")}>
            One-tap buttons on your dashboard for expenses you log often.
          </p>
        </div>
        <Button variant="dash" onClick={openAdd} className="h-10 shrink-0 gap-1.5 px-4">
          <Icon name="plus" className="size-4" />
          Add preset
        </Button>
      </div>

      {data.quickAddPresets.length === 0 ? (
        <div className={cn(dashMuted, "px-5 py-8 text-center")}>
          <p className="text-sm font-medium text-(--dash-text)">No presets yet</p>
          <p className={cn(dashCaption, "mt-1")}>Create shortcuts for coffee, lunch, transport, and more.</p>
          <Button variant="dash" onClick={openAdd} className="mt-4 h-10">
            Create first preset
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.quickAddPresets.map((preset) => {
            const cat = data.categories.find((c) => c.id === preset.categoryId)
            const pm = PAYMENT_METHODS.find((p) => p.value === preset.paymentMethod)
            return (
              <li
                key={preset.id}
                className="dash-card flex flex-col gap-4 p-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--dash-muted)">
                    <Icon name={preset.icon} className="size-5 text-(--dash-text-muted)" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="truncate text-base font-semibold text-(--dash-text)">{preset.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-(--dash-muted) px-2 py-0.5 text-xs font-medium text-(--dash-text-muted)">
                        {cat?.name ?? preset.categoryId}
                      </span>
                      <span className="rounded-md bg-(--dash-muted) px-2 py-0.5 text-xs font-medium text-(--dash-text-muted)">
                        {pm?.label ?? preset.paymentMethod}
                      </span>
                    </div>
                    <p className="font-mono text-lg font-bold tabular-nums text-(--dash-text)">
                      {formatMoney(preset.amount, { symbol: data.settings.currencySymbol })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9 flex-1" onClick={() => openEdit(preset)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(preset)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <PresetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        categories={expenseCategories}
        currencySymbol={data.settings.currencySymbol}
        onSave={(payload) => {
          if (editing) {
            updateQuickAddPreset(editing.id, payload)
            toast.success("Preset updated")
          } else {
            addQuickAddPreset(payload)
            toast.success("Preset added")
          }
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

function PresetDialog({
  open,
  onOpenChange,
  editing,
  categories,
  currencySymbol,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: QuickAddPreset | null
  categories: { id: string; name: string }[]
  currencySymbol: string
  onSave: (payload: Omit<QuickAddPreset, "id">) => void
}) {
  const [label, setLabel] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [categoryId, setCategoryId] = React.useState("food")
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("cash")
  const [icon, setIcon] = React.useState("coffee")

  React.useEffect(() => {
    if (editing) {
      setLabel(editing.label)
      setAmount(String(editing.amount))
      setCategoryId(editing.categoryId)
      setPaymentMethod(editing.paymentMethod)
      setIcon(editing.icon)
    } else {
      setLabel("")
      setAmount("")
      setCategoryId(categories[0]?.id ?? "food")
      setPaymentMethod("cash")
      setIcon("coffee")
    }
  }, [editing, open, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!label.trim() || isNaN(num) || num <= 0) return
    onSave({
      label: label.trim(),
      amount: num,
      categoryId,
      paymentMethod,
      icon,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit preset" : "Add preset"}</DialogTitle>
          <DialogDescription>
            This button will appear on your dashboard for one-tap logging.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="space-y-1.5">
            <label className={dashLabel}>Label</label>
            <Input
              className={dashInput}
              placeholder="e.g. Coffee, Lunch, Bus"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={dashLabel}>Amount ({currencySymbol})</label>
              <Input
                className={dashInput}
                type="number"
                min={1}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className={dashLabel}>Payment</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="dash-input w-full px-3"
              >
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={dashLabel}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="dash-input w-full px-3"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={dashLabel}>Icon</label>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
              {QUICK_ADD_ICON_CHOICES.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition-colors",
                    icon === ic
                      ? "bg-(--dash-text) text-white"
                      : "bg-(--dash-muted) text-(--dash-text-muted) hover:bg-(--dash-muted-hover)",
                  )}
                >
                  <Icon name={ic} className="size-4" />
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="dash">
              {editing ? "Save changes" : "Add preset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
