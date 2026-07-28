"use client"

import * as React from "react"
import { AppShell, useUI } from "@/components/app-shell"
import { PageHeader, EmptyState } from "@/components/shared"
import { TransactionRow } from "@/components/transactions/transaction-row"
import { useStore } from "@/lib/store"
import { getCategory, sumExpenses, sumIncome } from "@/lib/selectors"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

type TypeFilter = "all" | "expense" | "income"

function TransactionsContent() {
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

  // Group by date
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
    <div className="w-full space-y-6 py-2">
      <PageHeader title="Transactions" description="All recorded expenses and income.">
        <Button onClick={ui.openAdd} className="gap-1.5 rounded-full px-5">
          <Icon name="plus" className="size-4" />
          Add Transaction
        </Button>
      </PageHeader>

      {/* Search and Simple Type Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icon
            name="search"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-full border-border/60 bg-card text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="x" className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center rounded-full bg-muted p-1 text-xs shrink-0">
          {(["all", "expense", "income"] as TypeFilter[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTypeFilter(tf)}
              className={`rounded-full px-3.5 py-1.5 font-medium capitalize transition-all ${
                typeFilter === tf
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="receipt-text"
          title="No transactions"
          message="No activity found matching your search."
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear Search
              </Button>
            ) : (
              <Button onClick={ui.openAdd}>Add First Transaction</Button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, txs]) => {
            const dayIncome = sumIncome(txs)
            const dayExpense = sumExpenses(txs)

            return (
              <div key={date} className="space-y-2">
                <div className="flex items-center justify-between px-2 text-xs text-muted-foreground font-medium">
                  <span>{date}</span>
                  <div className="flex items-center gap-2 font-mono">
                    {dayIncome > 0 && <span className="text-success">+{formatMoney(dayIncome, { symbol: data.settings.currencySymbol })}</span>}
                    {dayExpense > 0 && <span>-{formatMoney(dayExpense, { symbol: data.settings.currencySymbol })}</span>}
                  </div>
                </div>

                <Card className="border-border/50 shadow-none divide-y divide-border/40 overflow-hidden rounded-2xl">
                  {txs.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} onEdit={ui.openEdit} showDate={false} />
                  ))}
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <AppShell>
      <TransactionsContent />
    </AppShell>
  )
}
