"use client"

import * as React from "react"
import {
  PageHeader,
  EmptyState,
  ProgressBar,
  dashSegment,
  dashSegmentItem,
  dashSegmentItemActive,
  dashInput,
  DashPage,
  SummaryBar,
  FilterToolbar,
  PageHero,
  StatusBadge,
  DashboardCard,
} from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { loanTotals, loanStatus, loanRemaining } from "@/lib/selectors"
import { formatMoney, relativeDay, todayISO } from "@/lib/format"
import { Icon } from "@/lib/icon"
import type { Loan, LoanDirection } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function BorrowedPage() {
  const { data, addLoan, updateLoan, deleteLoan } = useStore()

  const [directionTab, setDirectionTab] = React.useState<LoanDirection | "all">("all")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "unpaid" | "overdue" | "paid">("all")
  const [search, setSearch] = React.useState("")

  const [loanModalOpen, setLoanModalOpen] = React.useState(false)
  const [editingLoan, setEditingLoan] = React.useState<Loan | null>(null)

  const [repayModalOpen, setRepayModalOpen] = React.useState(false)
  const [targetLoan, setTargetLoan] = React.useState<Loan | null>(null)
  const [repayAmount, setRepayAmount] = React.useState("")

  const totals = React.useMemo(() => loanTotals(data.loans), [data.loans])
  const netPosition = totals.lentOutstanding - totals.borrowedOutstanding

  const filteredLoans = React.useMemo(() => {
    return data.loans
      .filter((loan) => {
        if (directionTab !== "all" && loan.direction !== directionTab) return false

        if (search.trim()) {
          const q = search.toLowerCase().trim()
          const matchPerson = loan.person.toLowerCase().includes(q)
          const matchReason = loan.reason?.toLowerCase().includes(q)
          if (!matchPerson && !matchReason) return false
        }

        const status = loanStatus(loan)
        if (statusFilter === "unpaid" && status === "paid") return false
        if (statusFilter === "overdue" && status !== "overdue") return false
        if (statusFilter === "paid" && status !== "paid") return false

        return true
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [data.loans, directionTab, statusFilter, search])

  const handleOpenAdd = () => {
    setEditingLoan(null)
    setLoanModalOpen(true)
  }

  const handleOpenEdit = (loan: Loan) => {
    setEditingLoan(loan)
    setLoanModalOpen(true)
  }

  const handleOpenRepay = (loan: Loan) => {
    setTargetLoan(loan)
    setRepayAmount(String(loanRemaining(loan)))
    setRepayModalOpen(true)
  }

  const handleSaveRepayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetLoan) return
    const addAmt = parseFloat(repayAmount)
    if (!isNaN(addAmt) && addAmt > 0) {
      const nextRepaid = Math.min(targetLoan.amount, targetLoan.amountRepaid + addAmt)
      updateLoan(targetLoan.id, { amountRepaid: nextRepaid })
    }
    setRepayModalOpen(false)
  }

  const handleQuickSettle = (loan: Loan) => {
    updateLoan(loan.id, { amountRepaid: loan.amount })
  }

  return (
    <DashPage>
      <PageHeader
        title="Borrowed & lent"
        description="Track money you owe and money others owe you, with due dates and repayment progress."
      >
        <Button variant="dash" onClick={handleOpenAdd} className="h-11 w-full gap-1.5 px-5 sm:w-auto">
          <Icon name="plus" className="size-4" />
          Add record
        </Button>
      </PageHeader>

      <PageHero
        label="Net position"
        value={formatMoney(netPosition, { symbol: data.settings.currencySymbol, sign: true })}
        caption={
          <>
            You owe{" "}
            <strong className="font-semibold text-destructive">
              {formatMoney(totals.borrowedOutstanding, { symbol: data.settings.currencySymbol })}
            </strong>{" "}
            · Others owe you{" "}
            <strong className="font-semibold text-success">
              {formatMoney(totals.lentOutstanding, { symbol: data.settings.currencySymbol })}
            </strong>
          </>
        }
      >
        <div className="max-w-xl space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-(--dash-text-secondary)">Overall repayment progress</span>
            <span className="font-semibold tabular-nums">{Math.round(totals.repaymentPct)}%</span>
          </div>
          <ProgressBar value={totals.repaymentPct} tone="accent" className="h-2.5" />
        </div>
      </PageHero>

      <SummaryBar
        items={[
          {
            label: "I owe",
            value: formatMoney(totals.borrowedOutstanding, { symbol: data.settings.currencySymbol }),
            tone: "danger",
          },
          {
            label: "Owed to me",
            value: formatMoney(totals.lentOutstanding, { symbol: data.settings.currencySymbol }),
            tone: "success",
          },
          {
            label: "Overdue",
            value: totals.overdue.length,
            tone: totals.overdue.length > 0 ? "danger" : "default",
          },
          { label: "Records", value: data.loans.length },
        ]}
      />

      <FilterToolbar>
        <div className={cn(dashSegment, "w-full bg-[var(--dash-surface)] lg:w-auto")}>
          {(["all", "borrowed", "lent"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => setDirectionTab(dir)}
              className={cn(
                dashSegmentItem,
                directionTab === dir ? dashSegmentItemActive : "hover:text-[var(--dash-text)]",
              )}
            >
              {dir === "all" ? "All" : dir === "borrowed" ? "I owe" : "Owed to me"}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative min-w-0 flex-1 sm:w-56">
            <Icon
              name="search"
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dash-text-faint)]"
            />
            <Input
              placeholder="Search person or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(dashInput, "border-0 bg-[var(--dash-surface)] pl-10 shadow-none")}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="dash-input w-full px-3 text-sm sm:w-auto"
          >
            <option value="all">All statuses</option>
            <option value="unpaid">Outstanding</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Settled</option>
          </select>
        </div>
      </FilterToolbar>

      {filteredLoans.length === 0 ? (
        <EmptyState
          icon="hand-coins"
          title="No loan records found"
          message={
            data.loans.length === 0
              ? "Start tracking borrowed or lent money with due dates and repayment history."
              : "No records match your current filters."
          }
          action={<Button variant="dash" onClick={handleOpenAdd}>Add record</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredLoans.map((loan) => {
            const status = loanStatus(loan)
            const remaining = loanRemaining(loan)
            const pct = loan.amount > 0 ? (loan.amountRepaid / loan.amount) * 100 : 100
            const isBorrowed = loan.direction === "borrowed"

            return (
              <DashboardCard
                key={loan.id}
                title={loan.person}
                description={loan.reason || "No reason provided"}
                action={
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8 text-[var(--dash-text-muted)]">
                          <Icon name="ellipsis-vertical" className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(loan)}>
                        <Icon name="pencil" className="size-4" />
                        Edit details
                      </DropdownMenuItem>
                      {status !== "paid" ? (
                        <DropdownMenuItem onClick={() => handleQuickSettle(loan)}>
                          <Icon name="check-check" className="size-4" />
                          Mark settled
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => deleteLoan(loan.id)}>
                        <Icon name="trash-2" className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
                bodyClassName="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={isBorrowed ? "danger" : "success"} icon={isBorrowed ? "arrow-down-left" : "arrow-up-right"}>
                    {isBorrowed ? "Borrowed" : "Lent"}
                  </StatusBadge>
                  {status === "overdue" ? (
                    <StatusBadge tone="danger" icon="clock-alert">
                      Overdue
                    </StatusBadge>
                  ) : null}
                  {status === "paid" ? (
                    <StatusBadge tone="success" icon="circle-check">
                      Settled
                    </StatusBadge>
                  ) : null}
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Total
                    </p>
                    <p className="mt-1 font-mono text-2xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
                      {formatMoney(loan.amount, { symbol: data.settings.currencySymbol })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {status === "paid" ? "Status" : "Remaining"}
                    </p>
                    <p
                      className={cn(
                        "mt-1 font-mono text-base font-bold tabular-nums px-2.5 py-1 rounded-lg",
                        status === "paid"
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
                          : "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800",
                      )}
                    >
                      {status === "paid"
                        ? "Paid in full"
                        : formatMoney(remaining, { symbol: data.settings.currencySymbol })}
                    </p>
                  </div>
                </div>

                <ProgressBar
                  value={pct}
                  tone={status === "paid" ? "success" : status === "overdue" ? "danger" : "accent"}
                  className="h-3"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--dash-text-muted)]">
                  <span>Started {loan.date}</span>
                  {loan.dueDate ? (
                    <span className={status === "overdue" ? "font-semibold text-destructive" : ""}>
                      Due {relativeDay(loan.dueDate)} ({loan.dueDate})
                    </span>
                  ) : (
                    <span>No due date</span>
                  )}
                </div>

                {status !== "paid" ? (
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 flex-1 gap-1.5 text-xs"
                      onClick={() => handleOpenRepay(loan)}
                    >
                      <Icon name="hand-coins" className="size-3.5" />
                      Record payment
                    </Button>
                    <Button variant="dash" size="sm" className="h-9 text-xs" onClick={() => handleQuickSettle(loan)}>
                      Settle
                    </Button>
                  </div>
                ) : null}
              </DashboardCard>
            )
          })}
        </div>
      )}

      <LoanDialog
        open={loanModalOpen}
        onOpenChange={setLoanModalOpen}
        editingLoan={editingLoan}
        currencySymbol={data.settings.currencySymbol}
        onSave={(loanData) => {
          if (editingLoan) {
            updateLoan(editingLoan.id, loanData)
          } else {
            addLoan(loanData)
          }
          setLoanModalOpen(false)
        }}
      />

      <Dialog open={repayModalOpen} onOpenChange={setRepayModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment for {targetLoan?.person}</DialogTitle>
            <DialogDescription>Enter the amount paid toward this record.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRepayment} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="dash-label">Payment amount ({data.settings.currencySymbol})</label>
              <Input
                type="number"
                step="any"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="Enter amount"
                className={dashInput}
                required
                autoFocus
              />
              {targetLoan ? (
                <p className="dash-caption">
                  Outstanding: {formatMoney(loanRemaining(targetLoan), { symbol: data.settings.currencySymbol })}
                </p>
              ) : null}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setRepayModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="dash" type="submit">
                Record payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashPage>
  )
}

function LoanDialog({
  open,
  onOpenChange,
  editingLoan,
  currencySymbol,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingLoan: Loan | null
  currencySymbol: string
  onSave: (loan: Omit<Loan, "id" | "createdAt">) => void
}) {
  const [direction, setDirection] = React.useState<LoanDirection>("borrowed")
  const [person, setPerson] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [amountRepaid, setAmountRepaid] = React.useState("0")
  const [date, setDate] = React.useState(todayISO())
  const [dueDate, setDueDate] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (editingLoan) {
      setDirection(editingLoan.direction)
      setPerson(editingLoan.person)
      setAmount(String(editingLoan.amount))
      setAmountRepaid(String(editingLoan.amountRepaid))
      setDate(editingLoan.date)
      setDueDate(editingLoan.dueDate ?? "")
      setReason(editingLoan.reason ?? "")
      setNotes(editingLoan.notes ?? "")
    } else {
      setDirection("borrowed")
      setPerson("")
      setAmount("")
      setAmountRepaid("0")
      setDate(todayISO())
      setDueDate("")
      setReason("")
      setNotes("")
    }
  }, [editingLoan, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    const numRepaid = parseFloat(amountRepaid) || 0
    if (!person.trim() || isNaN(numAmount) || numAmount <= 0) return

    onSave({
      direction,
      person: person.trim(),
      amount: numAmount,
      amountRepaid: Math.min(numAmount, numRepaid),
      date,
      dueDate: dueDate || undefined,
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingLoan ? "Edit loan details" : "Add borrowed / lent record"}</DialogTitle>
          <DialogDescription>Track money taken from or given to others.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className={cn(dashSegment, "grid grid-cols-2 gap-1 p-1")}>
            <button
              type="button"
              onClick={() => setDirection("borrowed")}
              className={cn(
                dashSegmentItem,
                direction === "borrowed" ? "bg-[var(--dash-surface)] font-semibold text-destructive" : "",
              )}
            >
              I owe
            </button>
            <button
              type="button"
              onClick={() => setDirection("lent")}
              className={cn(
                dashSegmentItem,
                direction === "lent" ? "bg-[var(--dash-surface)] font-semibold text-success" : "",
              )}
            >
              Owed to me
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Person or entity</label>
            <Input
              placeholder="e.g. Rahim, Uncle, Brac Bank"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className={dashInput}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="dash-label">Total ({currencySymbol})</label>
              <Input
                type="number"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={dashInput}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="dash-label">Already repaid</label>
              <Input
                type="number"
                step="any"
                placeholder="0"
                value={amountRepaid}
                onChange={(e) => setAmountRepaid(e.target.value)}
                className={dashInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="dash-label">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={dashInput} required />
            </div>
            <div className="space-y-1.5">
              <label className="dash-label">Due date (optional)</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={dashInput} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Reason</label>
            <Input
              placeholder="e.g. Emergency medical, rent gap"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={dashInput}
            />
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Notes</label>
            <Textarea
              placeholder="Any reminder notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="dash" type="submit">
              {editingLoan ? "Save changes" : "Create record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
