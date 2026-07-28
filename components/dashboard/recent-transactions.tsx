"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { TransactionRow } from "@/components/transactions/transaction-row"
import { useUI } from "@/components/app-shell"
import { EmptyState } from "@/components/shared"
import { Icon } from "@/lib/icon"

export function RecentTransactions() {
  const { data } = useStore()
  const ui = useUI()

  const recent = [...data.transactions]
    .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
    .slice(0, 6)

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 bg-[#D4E4FF] px-5 py-3">
        <h2 className="font-serif font-extrabold text-sm text-neutral-900 uppercase tracking-wider">
          Recent Activity
        </h2>
        <Link
          href="/transactions"
          style={{ borderRadius: "0 999px 0 999px" }}
          className="bg-neutral-900 text-[#D4E4FF] px-4 py-1 text-[11px] font-extrabold hover:bg-neutral-800 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="p-5">
        {recent.length === 0 ? (
          <EmptyState
            icon="receipt-text"
            title="No transactions yet"
            message="Add your first expense or income to get started."
            action={
              <button
                onClick={ui.openAdd}
                style={{ borderRadius: "0 999px 0 999px" }}
                className="bg-[#FFD000] text-neutral-900 px-5 py-2 text-xs font-extrabold hover:brightness-105 transition-all"
              >
                <Icon name="plus" className="size-3.5 inline mr-1" />
                Add transaction
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recent.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onEdit={ui.openEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
