import { parseISO } from "./format"
import type { AppData, Category, Loan, Transaction } from "@/types"

/* ------------------------------ lookups ------------------------------ */

export function categoryMap(data: AppData): Record<string, Category> {
  return Object.fromEntries(data.categories.map((c) => [c.id, c]))
}

export function getCategory(data: AppData, id: string): Category | undefined {
  return data.categories.find((c) => c.id === id)
}

/* ------------------------------ dates ------------------------------ */

export interface DateRange {
  start: Date
  end: Date // exclusive
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function todayRange(now = new Date()): DateRange {
  const start = startOfDay(now)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

export function weekRange(now = new Date()): DateRange {
  const day = now.getDay() // 0 Sun..6 Sat
  const mondayOffset = (day + 6) % 7
  const start = startOfDay(now)
  start.setDate(start.getDate() - mondayOffset)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return { start, end }
}

export function monthRange(now = new Date()): DateRange {
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start, end }
}

export function quarterRange(now = new Date()): DateRange {
  const q = Math.floor(now.getMonth() / 3)
  const start = new Date(now.getFullYear(), q * 3, 1)
  const end = new Date(now.getFullYear(), q * 3 + 3, 1)
  return { start, end }
}

export function yearRange(now = new Date()): DateRange {
  return {
    start: new Date(now.getFullYear(), 0, 1),
    end: new Date(now.getFullYear() + 1, 0, 1),
  }
}

/** Pay cycle from salary date -> next salary date */
export function payCycle(salaryDate: number, now = new Date()) {
  const day = Math.min(Math.max(salaryDate, 1), 28)
  let start: Date
  if (now.getDate() >= day) {
    start = new Date(now.getFullYear(), now.getMonth(), day)
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 1, day)
  }
  const end = new Date(start.getFullYear(), start.getMonth() + 1, day)
  const today = startOfDay(now)
  const daysRemaining = Math.max(
    0,
    Math.round((end.getTime() - today.getTime()) / 86400000),
  )
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000)
  const daysElapsed = totalDays - daysRemaining
  return { start, end, daysRemaining, daysElapsed, totalDays }
}

export function inRange(t: Transaction, range: DateRange) {
  const d = parseISO(t.date)
  return d >= range.start && d < range.end
}

export function txInRange(txs: Transaction[], range: DateRange) {
  return txs.filter((t) => inRange(t, range))
}

/* ------------------------------ sums ------------------------------ */

export function sumExpenses(txs: Transaction[]) {
  return txs
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0)
}

export function sumIncome(txs: Transaction[]) {
  return txs
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0)
}

/* ------------------------------ loans ------------------------------ */

export type LoanStatus = "paid" | "partial" | "unpaid" | "overdue"

export function loanRemaining(loan: Loan) {
  return Math.max(0, loan.amount - loan.amountRepaid)
}

export function loanStatus(loan: Loan, now = new Date()): LoanStatus {
  const remaining = loanRemaining(loan)
  if (remaining <= 0) return "paid"
  if (loan.dueDate) {
    const due = parseISO(loan.dueDate)
    if (due < startOfDay(now)) return "overdue"
  }
  return loan.amountRepaid > 0 ? "partial" : "unpaid"
}

export function loanTotals(loans: Loan[], now = new Date()) {
  const borrowed = loans.filter((l) => l.direction === "borrowed")
  const lent = loans.filter((l) => l.direction === "lent")
  const borrowedOutstanding = borrowed.reduce((s, l) => s + loanRemaining(l), 0)
  const borrowedTotal = borrowed.reduce((s, l) => s + l.amount, 0)
  const borrowedRepaid = borrowed.reduce((s, l) => s + Math.min(l.amountRepaid, l.amount), 0)
  const lentOutstanding = lent.reduce((s, l) => s + loanRemaining(l), 0)
  const overdue = borrowed.filter((l) => loanStatus(l, now) === "overdue")
  const upcoming = borrowed
    .filter((l) => loanStatus(l, now) !== "paid" && loanStatus(l, now) !== "overdue" && l.dueDate)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
  return {
    borrowed,
    lent,
    borrowedOutstanding,
    borrowedTotal,
    borrowedRepaid,
    lentOutstanding,
    overdue,
    upcoming,
    repaymentPct: borrowedTotal > 0 ? (borrowedRepaid / borrowedTotal) * 100 : 100,
  }
}

/* ------------------------------ dashboard ------------------------------ */

export interface DashboardMetrics {
  currentBalance: number
  monthlyIncome: number
  totalExpenses: number
  remainingSalary: number
  todaySpending: number
  weekSpending: number
  monthSpending: number
  quarterSpending: number
  totalSavings: number
  borrowedOutstanding: number
  repaymentPct: number
  largestExpense?: Transaction
  mostUsedCategory?: { category: Category; total: number; count: number }
  daysRemaining: number
  safeDailyLimit: number
  cycleSpending: number
  cycleBudget: number
}

export function computeDashboard(data: AppData, now = new Date()): DashboardMetrics {
  const { transactions, settings } = data
  const cycle = payCycle(settings.salaryDate, now)
  const month = monthRange(now)

  const currentBalance = sumIncome(transactions) - sumExpenses(transactions)
  const monthTxs = txInRange(transactions, month)
  const monthlyIncome = sumIncome(monthTxs)
  const totalExpenses = sumExpenses(transactions)

  const cycleTxs = transactions.filter((t) => {
    const d = parseISO(t.date)
    return d >= cycle.start && d < cycle.end
  })
  const cycleSpending = sumExpenses(cycleTxs)
  const remainingSalary = settings.salary - cycleSpending

  const todaySpending = sumExpenses(txInRange(transactions, todayRange(now)))
  const weekSpending = sumExpenses(txInRange(transactions, weekRange(now)))
  const monthSpending = sumExpenses(monthTxs)
  const quarterSpending = sumExpenses(txInRange(transactions, quarterRange(now)))

  const totalSavings = transactions
    .filter((t) => t.type === "expense" && (t.categoryId === "savings" || t.categoryId === "investment"))
    .reduce((s, t) => s + t.amount, 0)

  const loans = loanTotals(data.loans, now)

  const expensesMonth = monthTxs.filter((t) => t.type === "expense")
  const largestExpense = [...expensesMonth].sort((a, b) => b.amount - a.amount)[0]

  const byCat = new Map<string, { total: number; count: number }>()
  for (const t of expensesMonth) {
    const cur = byCat.get(t.categoryId) ?? { total: 0, count: 0 }
    cur.total += t.amount
    cur.count += 1
    byCat.set(t.categoryId, cur)
  }
  let mostUsedCategory: DashboardMetrics["mostUsedCategory"]
  let topTotal = -1
  for (const [catId, v] of byCat) {
    if (v.total > topTotal) {
      const category = getCategory(data, catId)
      if (category) {
        mostUsedCategory = { category, total: v.total, count: v.count }
        topTotal = v.total
      }
    }
  }

  const remainingForCycle = Math.max(0, remainingSalary)
  const safeDailyLimit =
    cycle.daysRemaining > 0 ? remainingForCycle / cycle.daysRemaining : remainingForCycle

  const cycleBudget = settings.salary

  return {
    currentBalance,
    monthlyIncome,
    totalExpenses,
    remainingSalary,
    todaySpending,
    weekSpending,
    monthSpending,
    quarterSpending,
    totalSavings,
    borrowedOutstanding: loans.borrowedOutstanding,
    repaymentPct: loans.repaymentPct,
    largestExpense,
    mostUsedCategory,
    daysRemaining: cycle.daysRemaining,
    safeDailyLimit,
    cycleSpending,
    cycleBudget,
  }
}

/* ------------------------------ budgets ------------------------------ */

export interface BudgetUsage {
  category: Category
  budget: number
  spent: number
  remaining: number
  pct: number
  over: boolean
}

export function computeBudgetUsage(data: AppData, now = new Date()): BudgetUsage[] {
  const month = monthRange(now)
  const monthTxs = txInRange(data.transactions, month).filter(
    (t) => t.type === "expense",
  )
  const spentByCat = new Map<string, number>()
  for (const t of monthTxs) {
    spentByCat.set(t.categoryId, (spentByCat.get(t.categoryId) ?? 0) + t.amount)
  }
  return Object.entries(data.budgets)
    .map(([catId, budget]) => {
      const category = getCategory(data, catId)
      if (!category) return null
      const spent = spentByCat.get(catId) ?? 0
      const remaining = budget - spent
      const pct = budget > 0 ? (spent / budget) * 100 : 0
      return { category, budget, spent, remaining, pct, over: spent > budget }
    })
    .filter((x): x is BudgetUsage => x !== null)
    .sort((a, b) => b.pct - a.pct)
}
