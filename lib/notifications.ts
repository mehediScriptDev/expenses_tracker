import { parseISO, formatMoney } from "./format"
import {
  computeBudgetUsage,
  getCategory,
  loanTotals,
  monthRange,
  sumExpenses,
  txInRange,
} from "./selectors"
import type { AppData, AppNotification, Goal, NotificationType } from "@/types"

export type { AppNotification, NotificationType }

export const NOTIFICATION_PRESENTATION: Record<
  NotificationType,
  { label: string; icon: string; iconWrap: string }
> = {
  BUDGET_LIMIT_WARNING: {
    label: "Budget alert",
    icon: "target",
    iconWrap: "bg-[#E8F0FE] text-[#2563EB]",
  },
  BUDGET_LIMIT_EXCEEDED: {
    label: "Budget exceeded",
    icon: "circle-alert",
    iconWrap: "bg-[#FFF1E6] text-[#EA580C]",
  },
  GOAL_MILESTONE: {
    label: "Goal milestone reached",
    icon: "trophy",
    iconWrap: "bg-[#FEF9C3] text-[#CA8A04]",
  },
  DEBT_DUE_SOON: {
    label: "Debt due soon",
    icon: "clock-alert",
    iconWrap: "bg-[#FFE4E6] text-[#E11D48]",
  },
}

const TYPE_RANK: Record<NotificationType, number> = {
  BUDGET_LIMIT_EXCEEDED: 0,
  DEBT_DUE_SOON: 1,
  BUDGET_LIMIT_WARNING: 2,
  GOAL_MILESTONE: 3,
}

const READ_KEY = "finbuddy:notifications:read:v1"
const GOALS_KEY = "finbuddy:goals:v1"

const DAY = 86400000

const STATIC_NOTIFICATIONS: AppNotification[] = [
  {
    id: "static-budget-warning-food",
    type: "BUDGET_LIMIT_WARNING",
    message: "Your Food spending is 4% higher than last month.",
    href: "/budgets",
    createdAt: Date.now() - 2 * 60_000,
  },
  {
    id: "static-budget-warning-internet",
    type: "BUDGET_LIMIT_WARNING",
    message: "You've used 80% of your Internet budget.",
    href: "/budgets",
    createdAt: Date.now() - 60 * 60_000,
  },
  {
    id: "static-budget-exceeded-shopping",
    type: "BUDGET_LIMIT_EXCEEDED",
    message: "You've exceeded your Shopping budget this month.",
    href: "/budgets",
    createdAt: Date.now() - 3 * 60 * 60_000,
  },
  {
    id: "static-goal-half",
    type: "GOAL_MILESTONE",
    message: "You're halfway to your Emergency Safety Reserve goal!",
    href: "/goals",
    createdAt: Date.now() - DAY,
  },
  {
    id: "static-debt-due",
    type: "DEBT_DUE_SOON",
    message: "Payment to Rakib (friend) is due in 3 days.",
    href: "/borrowed",
    createdAt: Date.now() - 2 * DAY,
  },
]

function pctChange(cur: number, prev: number) {
  if (prev === 0) return cur === 0 ? 0 : 100
  return ((cur - prev) / prev) * 100
}

function loadGoals(): Goal[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(GOALS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Goal[]) : []
  } catch {
    return []
  }
}

function buildFromData(data: AppData, now = new Date()): AppNotification[] {
  const out: AppNotification[] = []
  const symbol = data.settings.currencySymbol
  const month = monthRange(now)
  const lastMonth = {
    start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    end: new Date(now.getFullYear(), now.getMonth(), 1),
  }

  const usage = computeBudgetUsage(data, now)
  for (const u of usage) {
    if (u.over) {
      out.push({
        id: `budget-exceeded-${u.category.id}`,
        type: "BUDGET_LIMIT_EXCEEDED",
        message: `You've exceeded your ${u.category.name} budget by ${formatMoney(u.spent - u.budget, { symbol })}.`,
        href: "/budgets",
        createdAt: now.getTime() - 30 * 60_000,
      })
    } else if (u.pct >= 80) {
      out.push({
        id: `budget-warning-${u.category.id}`,
        type: "BUDGET_LIMIT_WARNING",
        message: `You've used ${Math.round(u.pct)}% of your ${u.category.name} budget.`,
        href: "/budgets",
        createdAt: now.getTime() - 45 * 60_000,
      })
    }
  }

  for (const catId of Object.keys(data.budgets)) {
    const cat = getCategory(data, catId)
    if (!cat) continue
    const cur = sumExpenses(
      txInRange(data.transactions, month).filter((t) => t.categoryId === catId),
    )
    const prev = sumExpenses(
      txInRange(data.transactions, lastMonth).filter((t) => t.categoryId === catId),
    )
    if (prev > 0) {
      const change = pctChange(cur, prev)
      if (change >= 4 && !out.some((n) => n.id === `budget-spike-${catId}`)) {
        out.push({
          id: `budget-spike-${catId}`,
          type: "BUDGET_LIMIT_WARNING",
          message: `Your ${cat.name} spending is ${Math.round(change)}% higher than last month.`,
          href: "/budgets",
          createdAt: now.getTime() - 20 * 60_000,
        })
      }
    }
  }

  for (const goal of loadGoals()) {
    if (goal.targetAmount <= 0) continue
    const pct = (goal.currentAmount / goal.targetAmount) * 100
    if (pct >= 50 && pct < 100) {
      out.push({
        id: `goal-milestone-50-${goal.id}`,
        type: "GOAL_MILESTONE",
        message: `You're halfway to your ${goal.title} goal!`,
        href: "/goals",
        createdAt: goal.createdAt || now.getTime() - 5 * 60 * 60_000,
      })
    } else if (pct >= 100) {
      out.push({
        id: `goal-milestone-100-${goal.id}`,
        type: "GOAL_MILESTONE",
        message: `You reached your ${goal.title} goal — great work!`,
        href: "/goals",
        createdAt: goal.createdAt || now.getTime() - 6 * 60 * 60_000,
      })
    }
  }

  const { borrowed } = loanTotals(data.loans, now)
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  for (const loan of borrowed) {
    const remaining = loan.amount - loan.amountRepaid
    if (remaining <= 0 || !loan.dueDate) continue
    const due = parseISO(loan.dueDate).getTime()
    const daysUntil = Math.ceil((due - startToday) / DAY)
    const status = daysUntil < 0 ? "overdue" : daysUntil <= 7 ? "soon" : null
    if (!status) continue
    out.push({
      id: `debt-${loan.id}-${status}`,
      type: "DEBT_DUE_SOON",
      message:
        daysUntil < 0
          ? `Payment to ${loan.person} is overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"}.`
          : daysUntil === 0
            ? `Payment to ${loan.person} is due today.`
            : `Payment to ${loan.person} is due in ${daysUntil} day${daysUntil === 1 ? "" : "s"}.`,
      href: "/borrowed",
      createdAt: loan.createdAt || now.getTime() - 90 * 60_000,
    })
  }

  return out
}

export function getNotifications(data: AppData, now = new Date()): AppNotification[] {
  const dynamic = buildFromData(data, now)
  const dynamicIds = new Set(dynamic.map((n) => n.id))
  const staticOnes = STATIC_NOTIFICATIONS.filter((n) => !dynamicIds.has(n.id))

  return [...dynamic, ...staticOnes].sort(
    (a, b) =>
      b.createdAt - a.createdAt ||
      TYPE_RANK[a.type] - TYPE_RANK[b.type] ||
      a.message.localeCompare(b.message),
  )
}

export function formatNotificationTime(createdAt: number, now = Date.now()): string {
  const diff = Math.max(0, now - createdAt)
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const parsed = JSON.parse(window.localStorage.getItem(READ_KEY) ?? "[]") as unknown
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : [])
  } catch {
    return new Set()
  }
}

export function persistReadIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify([...ids]))
  } catch {
    /* quota / private mode */
  }
}

export function clearNotificationReadState() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(READ_KEY)
    window.dispatchEvent(new Event("finbuddy:notifications:reset"))
  } catch {
    /* private mode */
  }
}
