"use client"

import * as React from "react"
import { useUI } from "@/dashboard/layout/app-shell"
import {
  PageHeader,
  EmptyState,
  dashSegment,
  dashSegmentItem,
  dashSegmentItemActive,
  dashInput,
  DashPage,
  SummaryBar,
  FilterToolbar,
  DateGroupHeader,
} from "@/dashboard/shared"
import { TransactionRow } from "@/dashboard/transactions/transaction-row"
import { useStore } from "@/lib/store"
import { getCategory, sumExpenses, sumIncome } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type TypeFilter = "all" | "expense" | "income"

export default function TransactionsPage() {
  const { data } = useStore()
  const ui = useUI()

  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")

  const filteredTransactions = React.useMemo(() => {
    const list = Array.isArray(data.transactions) ? data.transactions : []

    return list
      .filter((tx) => {
        if (!tx) return false

        if (search.trim()) {
          const q = search.toLowerCase().trim()
          const cat = getCategory(data, tx.categoryId)
          const desc = (tx.description || "").toLowerCase()
          const catName = (cat?.name || "").toLowerCase()
          const merchant = (tx.merchant || "").toLowerCase()
          if (!desc.includes(q) && !catName.includes(q) && !merchant.includes(q)) {
            return false
          }
        }

        if (typeFilter === "expense" && tx.type !== "expense") return false
        if (typeFilter === "income" && tx.type !== "income") return false

        return true
      })
      .sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.createdAt || 0) - (a.createdAt || 0))
  }, [data, search, typeFilter])

  const totals = React.useMemo(() => {
    const income = sumIncome(filteredTransactions)
    const expense = sumExpenses(filteredTransactions)
    return { income, expense, net: income - expense, count: filteredTransactions.length }
  }, [filteredTransactions])

  const grouped = React.useMemo(() => {
    const groups: { [date: string]: typeof filteredTransactions } = {}
    for (const tx of filteredTransactions) {
      const txDate = tx.date || "Unknown Date"
      if (!groups[txDate]) groups[txDate] = []
      groups[txDate].push(tx)
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filteredTransactions])

  return (
    <DashPage>
      <PageHeader title="Transactions" description="Search, filter, and review every expense and income entry.">
        <Button variant="dash" onClick={ui.openAdd} className="h-11 w-full gap-1.5 px-5 sm:w-auto">
          <Icon name="plus" className="size-4" />
          Add transaction
        </Button>
      </PageHeader>

      <SummaryBar
        items={[
          { label: "Showing", value: totals.count },
          {
            label: "Income",
            value: formatMoney(totals.income, { symbol: data.settings.currencySymbol }),
            tone: "success",
          },
          {
            label: "Expenses",
            value: formatMoney(totals.expense, { symbol: data.settings.currencySymbol }),
          },
          {
            label: "Net",
            value: formatMoney(totals.net, { symbol: data.settings.currencySymbol, sign: true }),
            tone: totals.net >= 0 ? "success" : "danger",
          },
        ]}
      />

      <FilterToolbar>
        <div className="relative min-w-0 flex-1">
          <Icon
            name="search"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--dash-text-faint)"
          />
          <Input
            placeholder="Search description, category, or merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(dashInput, "border-0 bg-(--dash-surface) pl-10 shadow-none")}
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--dash-text-muted) hover:text-(--dash-text)"
              aria-label="Clear search"
            >
              <Icon name="x" className="size-4" />
            </button>
          ) : null}
        </div>

        <div className={cn(dashSegment, "w-full shrink-0 bg-(--dash-surface) sm:w-auto")}>
          {(["all", "expense", "income"] as TypeFilter[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTypeFilter(tf)}
              className={cn(
                dashSegmentItem,
                "flex-1 capitalize sm:flex-none",
                typeFilter === tf ? dashSegmentItemActive : "hover:text-(--dash-text)",
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </FilterToolbar>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="receipt-text"
          title="No transactions found"
          message={
            search || typeFilter !== "all"
              ? "Nothing matches your current filters. Try adjusting search or type."
              : "Your ledger is empty. Add your first expense or income to get started."
          }
          action={
            search || typeFilter !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setTypeFilter("all")
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button variant="dash" onClick={ui.openAdd}>
                Add first transaction
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {grouped.map(([date, txs]) => {
            const dayIncome = sumIncome(txs)
            const dayExpense = sumExpenses(txs)

            return (
              <section key={date} className="space-y-2">
                <DateGroupHeader
                  date={date}
                  income={dayIncome}
                  expense={dayExpense}
                  currencySymbol={data.settings.currencySymbol}
                />

                <div className="space-y-2">
                  {txs.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} onEdit={ui.openEdit} showDate={false} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </DashPage>
  )
}
