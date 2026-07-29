"use client"

import type { Transaction } from "@/types"
import { useStore } from "@/lib/store"
import { getCategory } from "@/lib/selectors"
import { formatMoney, formatTime, relativeDay } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { PAYMENT_METHODS } from "@/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

function MetaTag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "income" | "expense" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1",
        tone === "income" && "bg-[var(--dash-success-soft)] text-[var(--dash-income)] ring-[var(--dash-success-soft)]",
        tone === "expense" && "bg-[var(--dash-expense-soft)] text-[var(--dash-expense)] ring-[var(--dash-danger-soft)]",
        tone === "neutral" &&
          "bg-[var(--dash-surface)] text-[var(--dash-text-secondary)] ring-[var(--dash-border)]",
      )}
    >
      {children}
    </span>
  )
}

export function TransactionRow({
  tx,
  onEdit,
  showDate = true,
}: {
  tx: Transaction
  onEdit?: (tx: Transaction) => void
  showDate?: boolean
}) {
  const { data, deleteTransaction, duplicateTransaction } = useStore()
  const cat = getCategory(data, tx.categoryId)
  const isIncome = tx.type === "income"
  const pm = PAYMENT_METHODS.find((p) => p.value === tx.paymentMethod)
  const accent = cat?.color ?? "var(--muted-foreground)"

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl bg-[var(--dash-surface)] transition-all",
        "shadow-sm ring-1 ring-[var(--dash-border)] hover:ring-[var(--dash-border-strong)] hover:shadow-md",
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: accent }} aria-hidden />

      <div className="flex items-start gap-3 p-4 pl-5">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 28%, white)`,
            color: accent,
          }}
        >
          <Icon name={cat?.icon ?? "circle"} className="size-5" />
        </span>

        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-[15px] font-semibold text-[var(--dash-text)]">
                  {tx.description || cat?.name || "Transaction"}
                </h3>
                {tx.recurring ? <Icon name="repeat" className="size-3.5 shrink-0 text-[var(--dash-text-faint)]" /> : null}
              </div>
              {tx.merchant ? (
                <p className="truncate text-sm text-[var(--dash-text-muted)]">{tx.merchant}</p>
              ) : null}
            </div>

            <span
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1 font-mono text-sm font-bold tabular-nums ring-1",
                isIncome
                  ? "bg-[var(--dash-success-soft)] text-[var(--dash-income)] ring-[var(--dash-success-soft)]"
                  : "bg-[var(--dash-expense-soft)] text-[var(--dash-expense)] ring-[var(--dash-danger-soft)]",
              )}
            >
              {isIncome ? formatMoney(tx.amount, { sign: true }) : `-${formatMoney(tx.amount)}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {cat?.name ? <MetaTag>{cat.name}</MetaTag> : null}
            {pm ? <MetaTag>{pm.label}</MetaTag> : null}
            {showDate ? <MetaTag>{relativeDay(tx.date)}</MetaTag> : null}
            <MetaTag>{formatTime(tx.time)}</MetaTag>
            <MetaTag tone={isIncome ? "income" : "expense"}>{isIncome ? "Income" : "Expense"}</MetaTag>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-[var(--dash-text-muted)] opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 data-[popup-open]:opacity-100"
                aria-label="Transaction actions"
              >
                <Icon name="ellipsis-vertical" className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            {onEdit ? (
              <DropdownMenuItem onClick={() => onEdit(tx)}>
                <Icon name="pencil" className="size-4" />
                Edit
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => duplicateTransaction(tx.id)}>
              <Icon name="copy" className="size-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => deleteTransaction(tx.id)}>
              <Icon name="trash-2" className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}
