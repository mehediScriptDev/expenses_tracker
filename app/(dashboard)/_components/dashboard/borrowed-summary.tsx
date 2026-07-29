"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { loanTotals } from "@/lib/selectors"
import { formatMoney, relativeDay } from "@/lib/format"
import { ProgressBar, DashboardCard, dashLabel, dashStatValue, dashCaption, dashLink } from "@/dashboard/shared"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

export function BorrowedSummary() {
  const { data } = useStore()
  const t = loanTotals(data.loans)

  return (
    <DashboardCard
      title="Borrowed money"
      description="Outstanding loans and repayments"
      className="h-full"
      action={
        <Link href="/borrowed" className={dashLink}>
          Manage
        </Link>
      }
    >
      <div className="space-y-5">
        <div>
          <p className={dashLabel}>Still to repay</p>
          <p className={cn(dashStatValue, "mt-2")}>
            {formatMoney(t.borrowedOutstanding, { symbol: data.settings.currencySymbol })}
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className={dashCaption}>Repaid</span>
            <span className="font-semibold tabular-nums text-[#1A1A1A]">{Math.round(t.repaymentPct)}%</span>
          </div>
          <ProgressBar value={t.repaymentPct} tone="accent" />
        </div>

        {t.overdue.length > 0 ? (
          <div className="flex items-start gap-3 rounded-xl bg-[#FCEAEA] px-4 py-3.5">
            <Icon name="clock-alert" className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p className="text-sm font-medium text-[#1A1A1A]">
              {t.overdue.length} overdue {t.overdue.length === 1 ? "payment" : "payments"}
            </p>
          </div>
        ) : t.upcoming.length > 0 && t.upcoming[0].dueDate ? (
          <div className="flex items-start gap-3 rounded-xl bg-[#EDE9E1] px-4 py-3.5">
            <Icon name="calendar-clock" className="mt-0.5 size-5 shrink-0 text-[#5C5955]" />
            <p className={dashCaption}>
              Next due to{" "}
              <strong className="font-semibold text-[#1A1A1A]">{t.upcoming[0].person}</strong>{" "}
              {relativeDay(t.upcoming[0].dueDate)}
            </p>
          </div>
        ) : t.borrowedOutstanding === 0 ? (
          <div className="flex items-start gap-3 rounded-xl bg-[#E4F4E8] px-4 py-3.5">
            <Icon name="circle-check" className="mt-0.5 size-5 shrink-0 text-success" />
            <p className="text-sm font-medium text-[#1A1A1A]">All cleared. Nothing owed.</p>
          </div>
        ) : null}
      </div>
    </DashboardCard>
  )
}
