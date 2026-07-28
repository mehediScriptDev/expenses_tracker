import { parseISO } from "./format"
import {
  computeBudgetUsage,
  monthRange,
  payCycle,
  sumExpenses,
  txInRange,
  weekRange,
  getCategory,
  quarterRange,
  loanTotals,
} from "./selectors"
import type { AppData, Transaction } from "./types"

export type InsightTone = "positive" | "warning" | "danger" | "neutral"

export interface Insight {
  id: string
  tone: InsightTone
  icon: string
  title: string
  detail?: string
}

function shift(range: { start: Date; end: Date }, ms: number) {
  return { start: new Date(range.start.getTime() - ms), end: new Date(range.end.getTime() - ms) }
}

const DAY = 86400000

function pctChange(cur: number, prev: number) {
  if (prev === 0) return cur === 0 ? 0 : 100
  return ((cur - prev) / prev) * 100
}

export function computeInsights(data: AppData, now = new Date()): Insight[] {
  const insights: Insight[] = []
  const { transactions } = data

  const month = monthRange(now)
  const lastMonth = {
    start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    end: new Date(now.getFullYear(), now.getMonth(), 1),
  }
  const monthSpend = sumExpenses(txInRange(transactions, month))
  const lastMonthSpend = sumExpenses(txInRange(transactions, lastMonth))

  if (lastMonthSpend > 0) {
    const change = pctChange(monthSpend, lastMonthSpend)
    if (Math.abs(change) >= 5) {
      insights.push({
        id: "month-change",
        tone: change > 0 ? "warning" : "positive",
        icon: change > 0 ? "trending-up" : "trending-down",
        title:
          change > 0
            ? `You spent ${Math.round(change)}% more than last month`
            : `You spent ${Math.round(Math.abs(change))}% less than last month`,
        detail:
          change > 0
            ? "Your spending is climbing. Keep an eye on the categories below."
            : "Nice restraint. You are trending in the right direction.",
      })
    }
  }

  // week vs last week
  const week = weekRange(now)
  const weekSpend = sumExpenses(txInRange(transactions, week))
  const lastWeekSpend = sumExpenses(txInRange(transactions, shift(week, 7 * DAY)))
  if (lastWeekSpend > 0) {
    const change = pctChange(weekSpend, lastWeekSpend)
    if (Math.abs(change) >= 8) {
      insights.push({
        id: "week-change",
        tone: change > 0 ? "warning" : "positive",
        icon: "calendar",
        title:
          change > 0
            ? "You spent more this week than last week"
            : "You spent less this week compared to last week",
        detail: `${change > 0 ? "Up" : "Down"} ${Math.round(Math.abs(change))}% week over week.`,
      })
    }
  }

  // biggest category this month
  const monthExpenses = txInRange(transactions, month).filter((t) => t.type === "expense")
  const byCat = new Map<string, number>()
  for (const t of monthExpenses) byCat.set(t.categoryId, (byCat.get(t.categoryId) ?? 0) + t.amount)
  let topCat: string | undefined
  let topVal = 0
  for (const [c, v] of byCat) if (v > topVal) ((topVal = v), (topCat = c))
  if (topCat) {
    const cat = getCategory(data, topCat)
    if (cat) {
      insights.push({
        id: "top-cat",
        tone: "neutral",
        icon: cat.icon,
        title: `${cat.name} was your biggest expense this month`,
        detail: `You spent the most on ${cat.name.toLowerCase()} so far.`,
      })
    }
  }

  // category month-over-month spikes
  for (const [catId, cur] of byCat) {
    const prev = sumExpenses(
      txInRange(transactions, lastMonth).filter((t) => t.categoryId === catId),
    )
    if (prev > 0) {
      const change = pctChange(cur, prev)
      if (change >= 20) {
        const cat = getCategory(data, catId)
        if (cat) {
          insights.push({
            id: `cat-spike-${catId}`,
            tone: "warning",
            icon: "arrow-up-right",
            title: `${cat.name} expenses increased by ${Math.round(change)}%`,
            detail: "This category is growing faster than usual.",
          })
        }
      }
    }
  }

  // borrowing frequency this month
  const borrowsThisMonth = data.loans.filter((l) => {
    const d = parseISO(l.date)
    return l.direction === "borrowed" && d >= month.start && d < month.end
  }).length
  if (borrowsThisMonth >= 1) {
    insights.push({
      id: "borrow-count",
      tone: borrowsThisMonth >= 3 ? "danger" : "warning",
      icon: "hand-coins",
      title: `You borrowed money ${borrowsThisMonth} ${borrowsThisMonth === 1 ? "time" : "times"} this month`,
      detail:
        borrowsThisMonth >= 3
          ? "Frequent borrowing is a sign to tighten spending before payday."
          : "Try to build a small buffer so you borrow less next month.",
    })
  }

  // savings this quarter vs last
  const savingsCats = (t: Transaction) => t.categoryId === "savings" || t.categoryId === "investment"
  const q = quarterRange(now)
  const lastQ = {
    start: new Date(q.start.getFullYear(), q.start.getMonth() - 3, 1),
    end: q.start,
  }
  const savedThisQ = sumExpenses(txInRange(transactions, q).filter(savingsCats))
  const savedLastQ = sumExpenses(txInRange(transactions, lastQ).filter(savingsCats))
  if (savedThisQ > savedLastQ && savedThisQ > 0) {
    insights.push({
      id: "savings-quarter",
      tone: "positive",
      icon: "piggy-bank",
      title: "Your savings increased this quarter",
      detail: "You are setting aside more than the previous quarter. Keep it up.",
    })
  }

  // spending by day of week (last 60 days)
  const recent = transactions.filter((t) => {
    const d = parseISO(t.date)
    return t.type === "expense" && d.getTime() >= now.getTime() - 60 * DAY
  })
  if (recent.length >= 6) {
    const byDow = new Array(7).fill(0)
    for (const t of recent) byDow[parseISO(t.date).getDay()] += t.amount
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let hi = 0
    let lo = 0
    byDow.forEach((v, i) => {
      if (v > byDow[hi]) hi = i
      if (v < byDow[lo]) lo = i
    })
    if (byDow[hi] > 0) {
      insights.push({
        id: "dow-high",
        tone: "neutral",
        icon: "calendar-clock",
        title: `${names[hi]} is usually your highest spending day`,
        detail: `You tend to spend the least on ${names[lo]}.`,
      })
    }
  }

  return insights
}

/* --------------------------- warnings --------------------------- */

export function computeWarnings(data: AppData, now = new Date()): Insight[] {
  const warnings: Insight[] = []
  const { settings, transactions } = data
  const cycle = payCycle(settings.salaryDate, now)
  const cycleSpend = sumExpenses(
    transactions.filter((t) => {
      const d = parseISO(t.date)
      return d >= cycle.start && d < cycle.end
    }),
  )
  const remaining = settings.salary - cycleSpend

  // spending too fast: elapsed fraction vs spent fraction
  if (cycle.totalDays > 0 && settings.salary > 0) {
    const elapsedFrac = cycle.daysElapsed / cycle.totalDays
    const spentFrac = cycleSpend / settings.salary
    if (spentFrac > elapsedFrac + 0.15 && cycle.daysRemaining > 1) {
      warnings.push({
        id: "too-fast",
        tone: "danger",
        icon: "gauge",
        title: "You are spending too fast",
        detail: `You've used ${Math.round(spentFrac * 100)}% of your salary with ${cycle.daysRemaining} days left in this cycle.`,
      })
    }
  }

  // may run out before payday
  if (remaining <= 0 && cycle.daysRemaining > 0) {
    warnings.push({
      id: "out-of-money",
      tone: "danger",
      icon: "triangle-alert",
      title: "You may run out of money before payday",
      detail: `You have ${cycle.daysRemaining} days left and your salary is already used up.`,
    })
  } else if (cycle.daysRemaining > 0 && remaining / cycle.daysRemaining < 100 && remaining > 0) {
    warnings.push({
      id: "low-daily",
      tone: "warning",
      icon: "wallet-minimal",
      title: "Slow down to make it to payday",
      detail: `Only about ${Math.round(remaining / cycle.daysRemaining)} per day left for ${cycle.daysRemaining} days.`,
    })
  }

  // budgets over
  const usage = computeBudgetUsage(data, now)
  for (const u of usage) {
    if (u.over) {
      warnings.push({
        id: `budget-over-${u.category.id}`,
        tone: "danger",
        icon: "circle-alert",
        title: `${u.category.name} is over budget`,
        detail: `You've spent ${Math.round(u.pct)}% of your ${u.category.name.toLowerCase()} budget.`,
      })
    } else if (u.pct >= 85) {
      warnings.push({
        id: `budget-near-${u.category.id}`,
        tone: "warning",
        icon: "circle-alert",
        title: `${u.category.name} budget is almost gone`,
        detail: `${Math.round(u.pct)}% used this month.`,
      })
    }
  }

  // no savings this month
  const month = monthRange(now)
  const savedThisMonth = sumExpenses(
    txInRange(transactions, month).filter(
      (t) => t.categoryId === "savings" || t.categoryId === "investment",
    ),
  )
  if (savedThisMonth === 0) {
    warnings.push({
      id: "no-savings",
      tone: "warning",
      icon: "piggy-bank",
      title: "You haven't saved anything this month",
      detail: "Even a small amount set aside builds the habit.",
    })
  }

  // borrowing increasing
  const loans = loanTotals(data.loans, now)
  if (loans.overdue.length > 0) {
    warnings.push({
      id: "overdue-loans",
      tone: "danger",
      icon: "clock-alert",
      title: `${loans.overdue.length} loan payment${loans.overdue.length > 1 ? "s are" : " is"} overdue`,
      detail: "Repay overdue borrowings to avoid straining relationships.",
    })
  }

  return warnings
}
