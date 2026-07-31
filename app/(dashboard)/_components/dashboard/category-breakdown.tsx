"use client"

import { useStore } from "@/lib/store"
import { monthRange, txInRange, getCategory } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { DashboardCard, EmptyState, dashMeta } from "@/dashboard/shared"
import { cn } from "@/lib/utils"

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
    <DashboardCard
      title="Spending by category"
      description="Where your money went this month"
      action={<span className={cn(dashMeta, "shrink-0 text-[10px] sm:text-xs")}>This month</span>}
    >
      {rows.length === 0 ? (
        <EmptyState icon="pie-chart" title="No expenses yet" message="Add a transaction to see your breakdown." />
      ) : (
        <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-start">
          <div className="relative mx-auto shrink-0 lg:mx-0">
            <div
              className="size-32 rounded-full sm:size-44"
              style={{ background: `conic-gradient(${stops})` }}
              role="img"
              aria-label="Category spending donut chart"
            />
            <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white">
              <span className={cn(dashMeta, "text-[10px] sm:text-xs")}>Total</span>
              <span className="mt-0.5 font-mono text-sm font-bold tabular-nums text-[#1A1A1A] sm:mt-1 sm:text-lg">
                {formatMoney(total, { compact: true })}
              </span>
            </div>
          </div>

          <ul className="min-w-0 flex-1 space-y-3.5 sm:space-y-4">
            {rows.map((r) => {
              const pct = Math.round((r.value / total) * 100)
              return (
                <li key={r.cat!.id} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 min-w-0 sm:gap-3">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg shadow-2xs"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${r.cat!.color} 18%, white)`,
                        color: r.cat!.color,
                      }}
                    >
                      <Icon name={r.cat!.icon} className="size-3.5 shrink-0" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">{r.cat!.name}</span>
                    <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{pct}%</span>
                    <span className="shrink-0 text-right font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100 sm:text-sm">
                      {formatMoney(r.value, { symbol: data.settings.currencySymbol })}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80 ring-1 ring-black/5">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${pct}%`, backgroundColor: r.cat!.color }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </DashboardCard>
  )
}
