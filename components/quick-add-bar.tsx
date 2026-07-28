"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { Icon } from "@/lib/icon"
import { todayISO, nowTime, formatMoney } from "@/lib/format"
import type { PaymentMethod } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface Preset {
  label: string
  icon: string
  amount: number
  categoryId: string
  paymentMethod: PaymentMethod
}

const PRESETS: Preset[] = [
  { label: "Coffee", icon: "coffee", amount: 50, categoryId: "food", paymentMethod: "cash" },
  { label: "Bus", icon: "bus", amount: 40, categoryId: "transport", paymentMethod: "cash" },
  { label: "Lunch", icon: "utensils", amount: 150, categoryId: "food", paymentMethod: "bkash" },
  { label: "Fuel", icon: "fuel", amount: 200, categoryId: "fuel", paymentMethod: "cash" },
  { label: "Groceries", icon: "shopping-bag", amount: 500, categoryId: "food", paymentMethod: "bkash" },
]

export function QuickAddBar() {
  const { data, addTransaction, deleteTransaction } = useStore()
  const [text, setText] = React.useState("")

  // Smart natural text parser
  const parsed = React.useMemo(() => {
    if (!text.trim()) return null

    const tokens = text.trim().split(/\s+/)
    let amount = 0
    let categoryId = "other"
    let paymentMethod: PaymentMethod = "cash"
    let type: "expense" | "income" = "expense"
    const descWords: string[] = []

    const paymentKeywords: Record<string, PaymentMethod> = {
      cash: "cash",
      bkash: "bkash",
      nagad: "nagad",
      rocket: "rocket",
      card: "card",
      bank: "bank",
    }

    // Attempt to match category IDs or category names
    const catMap = new Map(data.categories.map((c) => [c.id, c.id]))
    const catNameMap = new Map(data.categories.map((c) => [c.name.toLowerCase(), c.id]))

    for (const token of tokens) {
      const lower = token.toLowerCase()

      // Amount detection (numeric string like 150 or 250.50)
      if (!amount && /^\d+(\.\d+)?$/.test(token)) {
        amount = parseFloat(token)
        continue
      }

      // Payment method match
      if (paymentKeywords[lower]) {
        paymentMethod = paymentKeywords[lower]
        continue
      }

      // Income keyword check
      if (lower === "income" || lower === "salary" || lower === "freelance") {
        type = "income"
      }

      // Category match
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

    return {
      amount,
      description,
      categoryId,
      paymentMethod,
      type,
    }
  }, [text, data.categories])

  const handleQuickAddPreset = (preset: Preset) => {
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
      action: {
        label: "Undo",
        onClick: () => deleteTransaction(tx.id),
      },
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
      {
        action: {
          label: "Undo",
          onClick: () => deleteTransaction(tx.id),
        },
      },
    )
  }

  return (
    <Card className="border-border/70 shadow-none bg-gradient-to-r from-card via-background to-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
            <Icon name="bolt" className="size-4 text-warning" />
            1-Tap Quick Expenses & Smart Entry
          </span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Type e.g. &quot;Lunch 180 food bkash&quot;
          </span>
        </div>

        {/* 1-Tap Presets Row */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handleQuickAddPreset(p)}
              className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 text-xs font-medium hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all active:scale-95"
            >
              <Icon name={p.icon} className="size-3.5" />
              <span>{p.label}</span>
              <span className="font-mono text-muted-foreground">
                {formatMoney(p.amount, { symbol: data.settings.currencySymbol })}
              </span>
            </button>
          ))}
        </div>

        {/* Natural language text entry */}
        <form onSubmit={handleSmartSubmit} className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <Input
              placeholder="Quick Add e.g. 'Subway 250 food' or 'Tea 30'..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-9 text-xs pr-8"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="x" className="size-3.5" />
              </button>
            )}
          </div>
          <Button type="submit" size="sm" className="h-9 px-3 text-xs gap-1.5 shrink-0">
            <Icon name="plus" className="size-3.5" />
            Log
          </Button>
        </form>

        {/* Smart Live Parsing Preview */}
        {parsed && parsed.amount > 0 && (
          <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground animate-in fade-in duration-200">
            <span className="truncate">
              Description: <strong className="text-foreground">{parsed.description}</strong>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded bg-background px-1.5 py-0.5 text-[10px] uppercase font-semibold">
                {parsed.categoryId}
              </span>
              <span className="rounded bg-background px-1.5 py-0.5 text-[10px] uppercase font-semibold">
                {parsed.paymentMethod}
              </span>
              <span className="font-mono font-bold text-foreground">
                {formatMoney(parsed.amount, { symbol: data.settings.currencySymbol })}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
