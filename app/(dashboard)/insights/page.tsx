"use client"

import * as React from "react"
import { EmptyState, CategoryBadge, DashPage, PageHeader } from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { txInRange, sumExpenses, sumIncome, getCategory } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const MONTH_FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function mRange(year: number, month: number) {
  return { start: new Date(year, month, 1), end: new Date(year, month + 1, 1) }
}
function yRange(year: number) {
  return { start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) }
}

export default function InsightsPage() {
  const { data } = useStore()
  const today = React.useMemo(() => new Date(), [])

  const [year, setYear]   = React.useState(today.getFullYear())
  const [month, setMonth] = React.useState(today.getMonth())

  const sym = data.settings.currencySymbol

  const yearBars = React.useMemo(() =>
    MONTH_SHORT.map((label, i) => {
      const range = mRange(year, i)
      const txs   = txInRange(data.transactions, range)
      return {
        label, monthIdx: i,
        expenses: sumExpenses(txs.filter(t => t.type === "expense")),
        income:   sumIncome(txs),
        isFuture: year === today.getFullYear() && i > today.getMonth(),
      }
    }), [data.transactions, year, today])

  const maxExpense = Math.max(...yearBars.map(b => b.expenses), 1)

  const yearTotal = React.useMemo(() => {
    const range = yRange(year)
    const txs   = txInRange(data.transactions, range)
    return {
      expenses: sumExpenses(txs.filter(t => t.type === "expense")),
      income:   sumIncome(txs),
    }
  }, [data.transactions, year])

  const selected = React.useMemo(() => {
    const range    = mRange(year, month)
    const txs      = txInRange(data.transactions, range)
    const expenses = txs.filter(t => t.type === "expense")
    const incomes  = txs.filter(t => t.type === "income")
    const totalExp = sumExpenses(expenses)
    const totalInc = sumIncome(txs)

    const catMap = new Map<string, { total: number; count: number }>()
    for (const t of expenses) {
      const cur = catMap.get(t.categoryId) ?? { total: 0, count: 0 }
      cur.total += t.amount; cur.count += 1
      catMap.set(t.categoryId, cur)
    }

    const cats = Array.from(catMap.entries())
      .map(([catId, v]) => {
        const cat = getCategory(data, catId)
        if (!cat) return null
        return { catId, cat, ...v, pct: totalExp > 0 ? (v.total / totalExp) * 100 : 0 }
      })
      .filter(Boolean)
      .sort((a, b) => b!.total - a!.total) as Array<{
        catId: string; cat: ReturnType<typeof getCategory> & object
        total: number; count: number; pct: number
      }>

    const topCat = cats[0] ?? null
    return { totalExp, totalInc, cats, txCount: expenses.length, incomeCount: incomes.length, topCat }
  }, [data, year, month])

  const savings = selected.totalInc - selected.totalExp

  const stats = [
    {
      label: "Total Spent",
      value: formatMoney(selected.totalExp, { symbol: sym }),
      sub: `${selected.txCount} transactions`,
      icon: "shopping-bag",
      cardBg: "bg-[#FDF0E9] dark:bg-[#381B0E]",
      textColor: "text-[#6E2E10] dark:text-[#FCD5C5]",
      iconBg: "bg-[#FCD8C5] text-[#52200A] dark:bg-[#5C2A15] dark:text-[#FCD5C5]",
      labelColor: "text-[#8C3D18] dark:text-[#FBBFA8]",
    },
    {
      label: "Income",
      value: formatMoney(selected.totalInc, { symbol: sym }),
      sub: `${selected.incomeCount} transactions`,
      icon: "trending-up",
      cardBg: "bg-[#EBF7EE] dark:bg-[#0B2E17]",
      textColor: "text-[#134D25] dark:text-[#C1F0CC]",
      iconBg: "bg-[#C4EAD0] text-[#0C3B1B] dark:bg-[#194D27] dark:text-[#C1F0CC]",
      labelColor: "text-[#196631] dark:text-[#9EE5AF]",
    },
    {
      label: savings >= 0 ? "Saved" : "Deficit",
      value: formatMoney(Math.abs(savings), { symbol: sym }),
      sub: savings >= 0 ? "Under income" : "Over income",
      icon: savings >= 0 ? "piggy-bank" : "alert-circle",
      cardBg: savings >= 0 ? "bg-[#EEF4FF] dark:bg-[#102347]" : "bg-[#FEE2E2] dark:bg-[#451212]",
      textColor: savings >= 0 ? "text-[#163870] dark:text-[#C7DBFF]" : "text-[#991B1B] dark:text-[#FCA5A5]",
      iconBg: savings >= 0 ? "bg-[#CFE1FF] text-[#0E2854] dark:bg-[#1E3B6E] dark:text-[#C7DBFF]" : "bg-[#FCA5A5] text-[#7F1D1D] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]",
      labelColor: savings >= 0 ? "text-[#1E4A94] dark:text-[#A8C7FF]" : "text-[#B91C1C] dark:text-[#FCA5A5]",
    },
    {
      label: "Top Category",
      value: selected.topCat ? selected.topCat.cat.name : "—",
      sub: selected.topCat ? formatMoney(selected.topCat.total, { symbol: sym }) : "No data",
      icon: selected.topCat ? selected.topCat.cat.icon : "tag",
      cardBg: "bg-[#FFF8D6] dark:bg-[#332A00]",
      textColor: "text-[#5C4500] dark:text-[#FFE999]",
      iconBg: "bg-[#FFE885] text-[#423200] dark:bg-[#524200] dark:text-[#FFE999]",
      labelColor: "text-[#7A5C00] dark:text-[#FFDF80]",
      iconColor: selected.topCat?.cat.color,
    },
  ]

  return (
    <DashPage>
      <PageHeader
        title="Insights"
        description="Understand where your money goes — by month, by year, by category."
      />

      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-card shadow-sm overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-7 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear(y => y - 1)}
              className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Icon name="chevron-left" className="size-4" />
            </button>
            <span className="text-xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums w-14 text-center">
              {year}
            </span>
            <button
              onClick={() => setYear(y => Math.min(y + 1, today.getFullYear()))}
              disabled={year >= today.getFullYear()}
              className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="chevron-right" className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-5 sm:gap-8">
            <div className="text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">{year} Total Spent</div>
              <div className="font-mono text-sm font-black text-rose-600 dark:text-rose-400 tabular-nums">
                {formatMoney(yearTotal.expenses, { symbol: sym })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">{year} Total Income</div>
              <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatMoney(yearTotal.income, { symbol: sym })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-7 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-1.5">
          {MONTH_SHORT.map((name, i) => {
            const isFuture = year === today.getFullYear() && i > today.getMonth()
            const isSelected = i === month
            return (
              <button
                key={name}
                type="button"
                disabled={isFuture}
                onClick={() => setMonth(i)}
                className={cn(
                  "h-7 px-3 rounded-lg text-[11px] font-bold transition-all",
                  isSelected
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm cursor-default"
                    : isFuture
                    ? "bg-neutral-100 dark:bg-neutral-800/50 text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer",
                )}
              >
                {name}
              </button>
            )
          })}
        </div>

        <div className="px-5 sm:px-7 pt-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-end gap-1 h-24">
            {yearBars.map((b) => {
              const isSelected = b.monthIdx === month
              const barH = b.expenses > 0 ? Math.max((b.expenses / maxExpense) * 100, 6) : 4
              const tone = isSelected
                ? "bg-neutral-900 dark:bg-white"
                : b.isFuture
                ? "bg-neutral-100 dark:bg-neutral-800/40"
                : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-500 dark:hover:bg-neutral-400"

              return (
                <div key={b.label} className="flex-1 h-full flex flex-col justify-end group relative">
                  {!b.isFuture && b.expenses > 0 && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block pointer-events-none">
                      <div className="whitespace-nowrap rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-white dark:text-black shadow-lg">
                        {formatMoney(b.expenses, { symbol: sym, compact: true })}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={b.isFuture}
                    onClick={() => { if (!b.isFuture) setMonth(b.monthIdx) }}
                    className={cn(
                      "w-3 sm:w-4 mx-auto rounded-t-md transition-all cursor-pointer",
                      tone,
                      b.isFuture ? "cursor-not-allowed" : "hover:scale-y-105"
                    )}
                    style={{ height: `${barH}%` }}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex gap-1 mt-1.5">
            {yearBars.map((b) => {
              const isSelected = b.monthIdx === month
              return (
                <span
                  key={b.label}
                  className={cn(
                    "flex-1 text-center text-[9px] font-extrabold uppercase",
                    isSelected ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 dark:text-neutral-600"
                  )}
                >
                  {b.label}
                </span>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 sm:px-7 py-4 border-b border-neutral-100 dark:border-neutral-800">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "min-w-0 overflow-hidden rounded-xl p-3.5 sm:p-4 border border-black/5 dark:border-white/5 shadow-2xs transition-transform hover:-translate-y-0.5",
                s.cardBg,
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl", s.iconBg)}
                  style={s.iconColor ? { backgroundColor: `${s.iconColor}28`, color: s.iconColor } : undefined}
                >
                  <Icon name={s.icon} className="size-4" aria-hidden />
                </span>
                <p className={cn("min-w-0 flex-1 truncate text-xs font-black uppercase tracking-wider", s.labelColor)}>
                  {s.label}
                </p>
              </div>
              <p className={cn("mt-2.5 truncate font-mono text-lg font-black tabular-nums tracking-tight sm:text-xl", s.textColor)}>
                {s.value}
              </p>
              <p className={cn("mt-0.5 truncate text-[11px] font-semibold opacity-70", s.labelColor)}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 bg-neutral-50 dark:bg-neutral-800/40">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
            {MONTH_FULL[month]} {year}
            <span className="ml-2 text-[11px] font-semibold text-neutral-400">
              · {selected.txCount} transactions
            </span>
          </h3>
          <span className="text-[11px] font-semibold text-neutral-400">
            {selected.cats.length} categories
          </span>
        </div>

        {selected.cats.length === 0 ? (
          <EmptyState
            icon="receipt"
            title="No expenses this month"
            message="No transactions recorded for this period."
            className="bg-transparent py-10"
          />
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
            {selected.cats.map((item, idx) => (
              <div
                key={item.catId}
                className="flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <span className="text-xs font-black text-neutral-300 dark:text-neutral-600 w-5 shrink-0 text-center">
                  #{idx + 1}
                </span>
                <span
                  className="w-1 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: item.cat.color }}
                />
                <div className="flex-1 min-w-0">
                  <CategoryBadge icon={item.cat.icon} color={item.cat.color} name={item.cat.name} size="sm" />
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 shrink-0 hidden sm:block">
                  {item.count} tx
                </span>
                <span className="font-mono text-sm font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums shrink-0">
                  {formatMoney(item.total, { symbol: sym })}
                </span>
                <span className={cn(
                  "shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-black tabular-nums min-w-12 text-center",
                  item.pct >= 40
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                    : item.pct >= 20
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
                )}>
                  {Math.round(item.pct)}%
                </span>
              </div>
            ))}

            <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-4 border-t-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60">
              <span className="shrink-0 rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white dark:text-black">
                Total
              </span>
              <div className="flex-1 text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                {MONTH_FULL[month]} {year}
              </div>
              <span className="text-[11px] font-semibold text-neutral-400 shrink-0 hidden sm:block">
                {selected.txCount} transactions
              </span>
              <span className="font-mono text-base font-black text-neutral-900 dark:text-neutral-100 tabular-nums shrink-0">
                {formatMoney(selected.totalExp, { symbol: sym })}
              </span>
              <span className="shrink-0 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-black text-white dark:text-black min-w-12 text-center">
                100%
              </span>
            </div>
          </div>
        )}
      </div>
    </DashPage>
  )
}
