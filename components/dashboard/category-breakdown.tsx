"use client"

import { useStore } from "@/lib/store"
import { monthRange, txInRange, getCategory } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { EmptyState } from "@/components/shared"

export function CategoryBreakdown() {
  const { data } = useStore()
  const month = monthRange()
  const expenses = txInRange(data.transactions, month).filter((t) => t.type === "expense")

  const byCat = new Map<string, number>()
  for (const t of expenses) byCat.set(t.categoryId, (byCat.get(t.categoryId) ?? 0) + t.amount)

  const total = [...byCat.values()].reduce((s, v) => s + v, 0)
  const rows = [...byCat.entries()]
    .map(([id, value]) => ({ cat: getCategory(data, id), value }))
    .filter((r) => r.cat)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  let acc = 0
  const stops = rows
    .map((r) => {
      const start = (acc / total) * 100
      acc += r.value
      const end = (acc / total) * 100
      return `${r.cat!.color} ${start}% ${end}%`
    })
    .join(", ")

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 bg-[#D1F2D9] px-5 py-3">
        <h2 className="font-serif font-extrabold text-sm text-neutral-900 uppercase tracking-wider">
          Spending by Category
        </h2>
        <span className="text-[11px] font-bold text-neutral-600 bg-white px-3 py-0.5 rounded-sm border border-neutral-200">
          This month
        </span>
      </div>

      <div className="p-5">
        {rows.length === 0 ? (
          <EmptyState icon="pie-chart" title="No expenses yet" message="Add a transaction to see your breakdown." />
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Donut */}
            <div className="relative shrink-0">
              <div
                className="size-36 rounded-full"
                style={{ background: `conic-gradient(${stops})` }}
                role="img"
                aria-label="Category spending donut chart"
              />
              <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white dark:bg-card border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total</span>
                <span className="font-mono text-sm font-black text-neutral-900 dark:text-foreground tabular-nums">
                  {formatMoney(total, { compact: true })}
                </span>
              </div>
            </div>

            {/* Legend */}
            <ul className="w-full flex-1 space-y-2">
              {rows.map((r) => {
                const pct = Math.round((r.value / total) * 100)
                return (
                  <li key={r.cat!.id} className="flex items-center gap-3">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: r.cat!.color }} />
                    <Icon name={r.cat!.icon} className="size-4 shrink-0 text-neutral-400" />
                    <span className="flex-1 truncate text-sm font-medium text-neutral-800 dark:text-foreground">
                      {r.cat!.name}
                    </span>
                    <span className="rounded-sm bg-neutral-100 dark:bg-muted border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 text-[11px] font-bold text-neutral-600 dark:text-muted-foreground">
                      {pct}%
                    </span>
                    <span className="w-20 text-right font-mono text-sm font-bold tabular-nums text-neutral-900 dark:text-foreground">
                      {formatMoney(r.value)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
