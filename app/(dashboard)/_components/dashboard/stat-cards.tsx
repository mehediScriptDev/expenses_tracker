"use client"

import { useStore } from "@/lib/store"
import { computeDashboard } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

export function StatCards() {
  const { data } = useStore()
  const m = computeDashboard(data)

  const cards = [
    {
      label: "Today",
      value: formatMoney(m.todaySpending, { symbol: data.settings.currencySymbol }),
      icon: "sun",
      accent: "bg-[#F8D7C4]",
      iconColor: "text-[#C84C1C]",
    },
    {
      label: "This Week",
      value: formatMoney(m.weekSpending, { symbol: data.settings.currencySymbol }),
      icon: "calendar-days",
      accent: "bg-[#D1F2D9]",
      iconColor: "text-[#1B7A42]",
    },
    {
      label: "This Month",
      value: formatMoney(m.monthSpending, { symbol: data.settings.currencySymbol }),
      icon: "calendar-range",
      accent: "bg-[#D4E4FF]",
      iconColor: "text-[#2552D0]",
    },
    {
      label: "Borrowed",
      value: formatMoney(m.borrowedOutstanding, { symbol: data.settings.currencySymbol }),
      icon: "hand-coins",
      accent: m.borrowedOutstanding > 0 ? "bg-[#FFD000]" : "bg-[#D1F2D9]",
      iconColor: m.borrowedOutstanding > 0 ? "text-neutral-900" : "text-[#1B7A42]",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-card overflow-hidden"
        >
          {/* Coloured top strip */}
          <div className={cn("px-4 py-2.5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700", c.accent)}>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-700">{c.label}</span>
            <Icon name={c.icon} className={cn("size-4", c.iconColor)} />
          </div>
          {/* Value */}
          <div className="px-4 py-4">
            <span className="font-mono text-xl font-black text-neutral-900 dark:text-foreground tabular-nums">
              {c.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
