"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { loanTotals } from "@/lib/selectors"
import { formatMoney, relativeDay } from "@/lib/format"
import { ProgressBar } from "@/components/shared"
import { Icon } from "@/lib/icon"

export function BorrowedSummary() {
  const { data } = useStore()
  const t = loanTotals(data.loans)

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-card overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 bg-[#FFD000] px-5 py-3">
        <h2 className="font-serif font-extrabold text-sm text-neutral-900 uppercase tracking-wider">
          Borrowed Money
        </h2>
        <Link
          href="/borrowed"
          style={{ borderRadius: "0 999px 0 999px" }}
          className="bg-neutral-900 text-[#FFD000] px-4 py-1 text-[11px] font-extrabold hover:bg-neutral-800 transition-colors"
        >
          Manage
        </Link>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-muted-foreground">
            Still to repay
          </p>
          <p className="mt-1 font-mono text-3xl font-black text-neutral-900 dark:text-foreground tabular-nums">
            {formatMoney(t.borrowedOutstanding, { symbol: data.settings.currencySymbol })}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-500 dark:text-muted-foreground">
            <span>Repaid</span>
            <span className="font-bold text-neutral-900 dark:text-foreground">{Math.round(t.repaymentPct)}%</span>
          </div>
          <ProgressBar value={t.repaymentPct} tone="success" className="h-2" />
        </div>

        {t.overdue.length > 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-destructive/10 border border-red-200 px-3 py-2.5 text-xs text-red-700 dark:text-destructive">
            <Icon name="clock-alert" className="size-4 shrink-0" />
            <span className="font-semibold">
              {t.overdue.length} overdue {t.overdue.length === 1 ? "payment" : "payments"}
            </span>
          </div>
        ) : t.upcoming.length > 0 && t.upcoming[0].dueDate ? (
          <div className="flex items-center gap-2 rounded-lg bg-neutral-50 dark:bg-muted border border-neutral-200 dark:border-neutral-700 px-3 py-2.5 text-xs text-neutral-600 dark:text-muted-foreground">
            <Icon name="calendar-clock" className="size-4 shrink-0" />
            <span>
              Next due to <strong>{t.upcoming[0].person}</strong> {relativeDay(t.upcoming[0].dueDate)}
            </span>
          </div>
        ) : t.borrowedOutstanding === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-success/10 border border-green-200 px-3 py-2.5 text-xs text-green-700 dark:text-success">
            <Icon name="circle-check" className="size-4 shrink-0" />
            <span className="font-semibold">All cleared. Nothing owed.</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
