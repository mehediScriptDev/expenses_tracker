"use client"

import * as React from "react"
import { PageHeader, EmptyState, ProgressBar } from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { loanTotals, loanStatus, loanRemaining } from "@/lib/selectors"
import { formatMoney, relativeDay, todayISO } from "@/lib/format"
import { Icon } from "@/lib/icon"
import type { Loan, LoanDirection } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

  const filteredLoans = React.useMemo(() => {
    return data.loans.filter((loan) => {
      // Direction
      if (directionTab !== "all" && loan.direction !== directionTab) return false

      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchPerson = loan.person.toLowerCase().includes(q)
        const matchReason = loan.reason?.toLowerCase().includes(q)
        if (!matchPerson && !matchReason) return false
      }

      // Status
      const status = loanStatus(loan)
      if (statusFilter === "unpaid" && (status === "paid")) return false
      if (statusFilter === "overdue" && status !== "overdue") return false
      if (statusFilter === "paid" && status !== "paid") return false

      return true
    }).sort((a, b) => b.createdAt - a.createdAt)
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
    const remaining = loanRemaining(loan)
    setRepayAmount(String(remaining))
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
    <div className="space-y-6">
        <PageHeader
          title="Borrowed & Lent"
          description="Keep track of money you've borrowed from or lent to family, friends, or institutions."
        >
          <Button onClick={handleOpenAdd} className="gap-1.5">
            <Icon name="plus" className="size-4" />
            Add Loan / Debt
          </Button>
        </PageHeader>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Outstanding Borrowed (I owe)</p>
              <p className="mt-1 text-xl font-bold text-destructive">
                {formatMoney(totals.borrowedOutstanding, { symbol: data.settings.currencySymbol })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Outstanding Lent (Owed to me)</p>
              <p className="mt-1 text-xl font-bold text-success">
                {formatMoney(totals.lentOutstanding, { symbol: data.settings.currencySymbol })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Overdue Debts</p>
              <p className={`mt-1 text-xl font-bold ${totals.overdue.length > 0 ? "text-destructive" : "text-foreground"}`}>
                {totals.overdue.length} {totals.overdue.length === 1 ? "item" : "items"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Repayment Progress</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {Math.round(totals.repaymentPct)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
            {(["all", "borrowed", "lent"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setDirectionTab(dir)}
                className={`rounded-md px-3 py-1.5 font-medium capitalize transition-all ${
                  directionTab === dir
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {dir === "all" ? "All Records" : dir === "borrowed" ? "Borrowed (I Owe)" : "Lent (Owed to Me)"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search person or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="unpaid">Outstanding Only</option>
              <option value="overdue">Overdue Only</option>
              <option value="paid">Settled Only</option>
            </select>
          </div>
        </div>

        {/* Loan Cards List */}
        {filteredLoans.length === 0 ? (
          <EmptyState
            icon="hand-coins"
            title="No loan or debt records found"
            message={
              data.loans.length === 0
                ? "You haven't added any borrowed or lent money records yet."
                : "No items match your active filter criteria."
            }
            action={<Button onClick={handleOpenAdd}>Add New Record</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredLoans.map((loan) => {
              const status = loanStatus(loan)
              const remaining = loanRemaining(loan)
              const pct = loan.amount > 0 ? (loan.amountRepaid / loan.amount) * 100 : 100
              const isBorrowed = loan.direction === "borrowed"

              return (
                <Card key={loan.id} className="border-border/60 shadow-none">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                              isBorrowed
                                ? "bg-destructive/10 text-destructive"
                                : "bg-success/10 text-success"
                            }`}
                          >
                            <Icon name={isBorrowed ? "arrow-down-left" : "arrow-up-right"} className="size-3.5" />
                            {isBorrowed ? "Borrowed" : "Lent"}
                          </span>

                          {status === "overdue" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">
                              <Icon name="clock-alert" className="size-3" />
                              Overdue
                            </span>
                          )}

                          {status === "paid" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                              <Icon name="circle-check" className="size-3" />
                              Settled
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-semibold truncate">{loan.person}</h3>
                        {loan.reason && (
                          <p className="text-xs text-muted-foreground truncate">{loan.reason}</p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                              <Icon name="ellipsis-vertical" className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(loan)}>
                            <Icon name="pencil" className="size-4" />
                            Edit Details
                          </DropdownMenuItem>
                          {status !== "paid" && (
                            <DropdownMenuItem onClick={() => handleQuickSettle(loan)}>
                              <Icon name="check-check" className="size-4" />
                              Mark Fully Settled
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => deleteLoan(loan.id)}>
                            <Icon name="trash-2" className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-muted-foreground">Total: {formatMoney(loan.amount, { symbol: data.settings.currencySymbol })}</span>
                        <span className="font-semibold text-foreground">
                          {status === "paid"
                            ? "Paid in Full"
                            : `Remaining: ${formatMoney(remaining, { symbol: data.settings.currencySymbol })}`}
                        </span>
                      </div>

                      <ProgressBar
                        value={pct}
                        tone={status === "paid" ? "success" : status === "overdue" ? "danger" : "primary"}
                        className="h-2"
                      />

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                        <span>Date: {loan.date}</span>
                        {loan.dueDate && (
                          <span className={status === "overdue" ? "text-destructive font-medium" : ""}>
                            Due: {relativeDay(loan.dueDate)} ({loan.dueDate})
                          </span>
                        )}
                      </div>
                    </div>

                    {status !== "paid" && (
                      <div className="pt-1 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs gap-1.5 h-8"
                          onClick={() => handleOpenRepay(loan)}
                        >
                          <Icon name="hand-coins" className="size-3.5" />
                          Record Payment
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handleQuickSettle(loan)}
                        >
                          Settle
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Add/Edit Loan Dialog */}
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

        {/* Repayment Dialog */}
        <Dialog open={repayModalOpen} onOpenChange={setRepayModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment for {targetLoan?.person}</DialogTitle>
              <DialogDescription>
                Enter the amount paid towards this debt record.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveRepayment} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Payment Amount ({data.settings.currencySymbol})
                </label>
                <Input
                  type="number"
                  step="any"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  autoFocus
                />
                {targetLoan && (
                  <p className="text-[11px] text-muted-foreground">
                    Current outstanding: {formatMoney(loanRemaining(targetLoan), { symbol: data.settings.currencySymbol })}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setRepayModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
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
          <DialogTitle>{editingLoan ? "Edit Loan Details" : "Add Borrowed / Lent Record"}</DialogTitle>
          <DialogDescription>
            Track money taken from or given to family, friends, or lenders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Direction toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1 text-xs">
            <button
              type="button"
              onClick={() => setDirection("borrowed")}
              className={`rounded-md py-2 font-semibold transition-all ${
                direction === "borrowed"
                  ? "bg-background text-destructive shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Borrowed (I Owe)
            </button>
            <button
              type="button"
              onClick={() => setDirection("lent")}
              className={`rounded-md py-2 font-semibold transition-all ${
                direction === "lent"
                  ? "bg-background text-success shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lent (Owed to Me)
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Person or Entity Name</label>
            <Input
              placeholder="e.g. Rahim, Uncle, Brac Bank"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Total Amount ({currencySymbol})</label>
              <Input
                type="number"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Amount Already Repaid</label>
              <Input
                type="number"
                step="any"
                placeholder="0"
                value={amountRepaid}
                onChange={(e) => setAmountRepaid(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Date Taken/Given</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Due Date (Optional)</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Reason / Purpose</label>
            <Input
              placeholder="e.g. Emergency medical expenses, rent gap"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Additional Notes</label>
            <Textarea
              placeholder="Any details or reminder notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingLoan ? "Save Changes" : "Create Record"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
