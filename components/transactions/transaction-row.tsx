"use client"

import type { Transaction } from "@/lib/types"
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

  return (
    <div className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `color-mix(in oklch, ${cat?.color ?? "var(--muted-foreground)"} 16%, transparent)`,
          color: cat?.color ?? "var(--muted-foreground)",
        }}
      >
        <Icon name={cat?.icon ?? "circle"} className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{tx.description || cat?.name || "Transaction"}</p>
          {tx.recurring ? <Icon name="repeat" className="size-3.5 shrink-0 text-muted-foreground" /> : null}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span>{cat?.name}</span>
          <span aria-hidden>·</span>
          {pm ? <span>{pm.label}</span> : null}
          {showDate ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {relativeDay(tx.date)} {formatTime(tx.time)}
              </span>
            </>
          ) : (
            <>
              <span aria-hidden>·</span>
              <span>{formatTime(tx.time)}</span>
            </>
          )}
          {tx.merchant ? (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">{tx.merchant}</span>
            </>
          ) : null}
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 font-mono text-sm font-semibold tabular-nums",
          isIncome ? "text-success" : "text-foreground",
        )}
      >
        {isIncome ? formatMoney(tx.amount, { sign: true }) : `-${formatMoney(tx.amount)}`}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 data-[popup-open]:opacity-100"
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
  )
}
