"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { TransactionRow } from "@/dashboard/transactions/transaction-row"
import { useUI } from "@/dashboard/layout/app-shell"
import { DashboardCard, EmptyState, dashLink } from "@/dashboard/shared"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"

export function RecentTransactions() {
  const { data } = useStore()
  const ui = useUI()

  const recent = [...data.transactions]
    .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
    .slice(0, 6)

  return (
    <DashboardCard
      title="Recent activity"
      description="Your latest transactions"
      action={
        <Link href="/transactions" className={dashLink}>
          View all
        </Link>
      }
      bodyClassName="p-0 sm:p-0"
    >
      {recent.length === 0 ? (
        <div className="p-5 sm:p-6">
          <EmptyState
            icon="receipt-text"
            title="No transactions yet"
            message="Add your first expense or income to get started."
            action={
              <Button variant="dash" onClick={ui.openAdd} size="sm" className="h-10 px-5">
                <Icon name="plus" className="size-4" />
                Add transaction
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-2 px-3 pb-4 sm:px-4">
          {recent.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} onEdit={ui.openEdit} />
          ))}
        </div>
      )}
    </DashboardCard>
  )
}
