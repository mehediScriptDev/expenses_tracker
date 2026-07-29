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

  const meta = [
    cat?.name,
    pm?.label,
    showDate ? relativeDay(tx.date) : null,
    formatTime(tx.time),
  ].filter(Boolean)

  return (
    <article className="group flex items-center gap-3 rounded-xl bg-(--dash-surface) px-3 py-3 ring-1 ring-(--dash-border) sm:px-4">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10"
        style={{
          backgroundColor: `color-mix(in oklch, ${accent} 28%, white)`,
          color: accent,
        }}
      >
        <Icon name={cat?.icon ?? "circle"} className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-(--dash-text)">
              {tx.description || cat?.name || "Transaction"}
              {tx.recurring ? (
                <Icon name="repeat" className="ml-1.5 inline size-3 text-(--dash-text-faint)" aria-hidden />
              ) : null}
            </p>
            {tx.merchant ? (
              <p className="truncate text-xs text-(--dash-text-muted)">{tx.merchant}</p>
            ) : meta.length > 0 ? (
              <p className="truncate text-xs text-(--dash-text-muted)">{meta.join(" · ")}</p>
            ) : null}
          </div>

          <span
            className={cn(
              "shrink-0 font-mono text-sm font-bold tabular-nums",
              isIncome ? "text-(--dash-income)" : "text-(--dash-expense)",
            )}
          >
            {isIncome ? formatMoney(tx.amount, { sign: true }) : `-${formatMoney(tx.amount)}`}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-(--dash-text-muted) opacity-100 sm:opacity-0 sm:group-hover:opacity-100 data-popup-open:opacity-100"
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
    </article>
  )
}
