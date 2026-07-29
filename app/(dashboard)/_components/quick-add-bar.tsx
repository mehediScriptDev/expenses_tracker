"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { Icon } from "@/lib/icon"
import { todayISO, nowTime, formatMoney } from "@/lib/format"
import type { QuickAddPreset } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardCard, dashCaption, dashInput, dashMuted } from "@/dashboard/shared"
import { QuickAddPresetsManager } from "@/dashboard/quick-add-presets-manager"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function QuickAddBar() {
  const { data, addTransaction, deleteTransaction } = useStore()
  const [text, setText] = React.useState("")

  const presets = data.quickAddPresets

  const parsed = React.useMemo(() => {
    if (!text.trim()) return null

    const tokens = text.trim().split(/\s+/)
    let amount = 0
    let categoryId = "other"
    let paymentMethod: typeof data.transactions[0]["paymentMethod"] = "cash"
    let type: "expense" | "income" = "expense"
    const descWords: string[] = []

    const paymentKeywords: Record<string, typeof paymentMethod> = {
      cash: "cash",
      bkash: "bkash",
      nagad: "nagad",
      rocket: "rocket",
      card: "card",
      bank: "bank",
    }

    const catMap = new Map(data.categories.map((c) => [c.id, c.id]))
    const catNameMap = new Map(data.categories.map((c) => [c.name.toLowerCase(), c.id]))

    for (const token of tokens) {
      const lower = token.toLowerCase()

      if (!amount && /^\d+(\.\d+)?$/.test(token)) {
        amount = parseFloat(token)
        continue
      }

      if (paymentKeywords[lower]) {
        paymentMethod = paymentKeywords[lower]
        continue
      }

      if (lower === "income" || lower === "salary" || lower === "freelance") {
        type = "income"
      }

      if (catMap.has(lower)) {
        categoryId = catMap.get(lower)!
        continue
      } else if (catNameMap.has(lower)) {
        categoryId = catNameMap.get(lower)!
        continue
      }

      descWords.push(token)
    }

    const description = descWords.join(" ") || "Quick Transaction"

    return { amount, description, categoryId, paymentMethod, type }
  }, [text, data.categories])

  const handleQuickAddPreset = (preset: QuickAddPreset) => {
    const tx = addTransaction({
      type: "expense",
      amount: preset.amount,
      categoryId: preset.categoryId,
      description: preset.label,
      date: todayISO(),
      time: nowTime(),
      paymentMethod: preset.paymentMethod,
      tags: ["quick-add"],
      recurring: false,
    })

    toast.success(`Added ${preset.label} (${formatMoney(preset.amount, { symbol: data.settings.currencySymbol })})`, {
      action: { label: "Undo", onClick: () => deleteTransaction(tx.id) },
    })
  }

  const handleSmartSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parsed || parsed.amount <= 0) {
      toast.error("Please enter a valid amount (e.g. 'Coffee 150')")
      return
    }

    const tx = addTransaction({
      type: parsed.type,
      amount: parsed.amount,
      categoryId: parsed.categoryId,
      description: parsed.description,
      date: todayISO(),
      time: nowTime(),
      paymentMethod: parsed.paymentMethod,
      tags: ["smart-add"],
      recurring: false,
    })

    setText("")
    toast.success(
      `Added ${parsed.description} (${formatMoney(parsed.amount, { symbol: data.settings.currencySymbol })})`,
      { action: { label: "Undo", onClick: () => deleteTransaction(tx.id) } },
    )
  }

  return (
    <DashboardCard
      title="Quick add"
      description="Log spending in one tap or one line"
      action={<QuickAddPresetsManager compact />}
      bodyClassName="space-y-4"
    >
      {presets.length === 0 ? (
        <div className={cn(dashMuted, "px-4 py-6 text-center")}>
          <p className="text-sm font-semibold text-(--dash-text)">No quick-add buttons yet</p>
          <p className={cn(dashCaption, "mt-1")}>
            Add presets in Settings to log coffee, lunch, transport, and more in one tap.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleQuickAddPreset(p)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--dash-muted) px-3 py-2.5 text-sm font-medium text-(--dash-text) transition-colors hover:bg-(--dash-muted-hover)"
            >
              <Icon name={p.icon} className="size-4 text-(--dash-text-muted)" />
              <span>{p.label}</span>
              <span className="font-mono text-sm font-semibold text-(--dash-text-muted)">
                {formatMoney(p.amount, { symbol: data.settings.currencySymbol })}
              </span>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSmartSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Input
            placeholder="e.g. Lunch 180 food bkash"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={dashInput}
          />
          {text ? (
            <button
              type="button"
              onClick={() => setText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--dash-text-faint) hover:text-(--dash-text)"
              aria-label="Clear input"
            >
              <Icon name="x" className="size-4" />
            </button>
          ) : null}
        </div>
        <Button type="submit" variant="dash" className="h-11 w-full shrink-0 px-5 sm:w-auto">
          Log
        </Button>
      </form>

      {parsed && parsed.amount > 0 ? (
        <div className={cn(dashMuted, "px-4 py-3 text-sm")}>
          <span className="font-semibold text-(--dash-text)">{parsed.description}</span>
          <span className="mx-2 text-(--dash-text-faint)">·</span>
          <span className="font-medium uppercase text-(--dash-text-muted)">{parsed.categoryId}</span>
          <span className="mx-2 text-(--dash-text-faint)">·</span>
          <span className="font-mono font-bold text-(--dash-text)">
            {formatMoney(parsed.amount, { symbol: data.settings.currencySymbol })}
          </span>
        </div>
      ) : (
        <p className={dashCaption}>Tip: type amount, description, category, and payment method together.</p>
      )}
    </DashboardCard>
  )
}
