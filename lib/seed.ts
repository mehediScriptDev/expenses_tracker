import { DEFAULT_CATEGORIES, DEFAULT_QUICK_ADD_PRESETS } from "./constants"
import { toISODate } from "./format"
import type { AppData, Loan, Transaction } from "@/types"

let counter = 0
function id(prefix = "t") {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter}`
}

function makeTx(
  daysAgo: number,
  amount: number,
  categoryId: string,
  description: string,
  extra: Partial<Transaction> = {},
): Transaction {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return {
    id: id(),
    type: extra.type ?? "expense",
    amount,
    categoryId,
    description,
    date: toISODate(d),
    time: extra.time ?? "13:30",
    paymentMethod: extra.paymentMethod ?? "cash",
    merchant: extra.merchant,
    location: extra.location,
    notes: extra.notes,
    mood: extra.mood,
    tags: extra.tags ?? [],
    recurring: extra.recurring ?? false,
    createdAt: d.getTime(),
  }
}

export function buildSeedData(): AppData {
  const now = new Date()
  const salaryDay = 1

  // income: salary at start of this month
  const salaryThis = new Date(now.getFullYear(), now.getMonth(), salaryDay)
  const daysSinceSalary = Math.max(
    0,
    Math.round((now.getTime() - salaryThis.getTime()) / 86400000),
  )

  const transactions: Transaction[] = [
    {
      id: id(),
      type: "income",
      amount: 16000,
      categoryId: "salary",
      description: "Monthly salary",
      date: toISODate(salaryThis),
      time: "10:00",
      paymentMethod: "bank",
      merchant: "Employer",
      tags: ["salary"],
      recurring: true,
      createdAt: salaryThis.getTime(),
    },
    // this month expenses
    makeTx(Math.min(daysSinceSalary, 1), 120, "food", "Lunch at campus", { merchant: "Canteen", mood: "necessary", paymentMethod: "cash", time: "13:15" }),
    makeTx(1, 60, "transport", "Bus to office", { mood: "necessary", paymentMethod: "cash", time: "09:00" }),
    makeTx(2, 350, "food", "Groceries", { merchant: "Shwapno", mood: "necessary", paymentMethod: "bkash" }),
    makeTx(2, 200, "internet", "Broadband bill", { merchant: "Link3", mood: "necessary", recurring: true, paymentMethod: "bkash" }),
    makeTx(3, 800, "gifts", "Flowers for wife", { mood: "happy", paymentMethod: "cash", notes: "Anniversary surprise", tags: ["wife"] }),
    makeTx(3, 90, "transport", "Rickshaw", { mood: "necessary" }),
    makeTx(4, 1500, "parents", "Sent to parents", { mood: "necessary", paymentMethod: "bkash", tags: ["family"] }),
    makeTx(5, 250, "entertainment", "Movie night", { merchant: "Star Cineplex", mood: "luxury", paymentMethod: "card" }),
    makeTx(5, 180, "food", "Dinner out", { merchant: "Sultan's Dine", mood: "luxury" }),
    makeTx(6, 500, "shopping", "New shirt", { merchant: "Aarong", mood: "regret", paymentMethod: "card", notes: "Didn't really need this" }),
    makeTx(7, 300, "university", "Semester supplies", { mood: "necessary" }),
    makeTx(8, 70, "food", "Tea & snacks", { mood: "happy" }),
    makeTx(9, 400, "medical", "Medicine", { merchant: "Lazz Pharma", mood: "necessary", paymentMethod: "bkash" }),
    makeTx(10, 150, "fuel", "Bike fuel", { mood: "necessary" }),
    makeTx(11, 60, "transport", "Bus", { mood: "necessary" }),
    makeTx(12, 220, "food", "Groceries", { mood: "necessary", paymentMethod: "bkash" }),
    makeTx(13, 999, "subscriptions", "Phone recharge + Netflix", { mood: "luxury", recurring: true, paymentMethod: "card" }),
    // last month (30+ days ago) for comparison
    makeTx(34, 700, "food", "Groceries", { mood: "necessary" }),
    makeTx(36, 300, "transport", "Monthly commute", { mood: "necessary" }),
    makeTx(38, 1200, "parents", "Support", { mood: "necessary" }),
    makeTx(40, 400, "shopping", "Household", { mood: "necessary" }),
    makeTx(42, 200, "entertainment", "Outing", { mood: "happy" }),
    makeTx(44, 250, "internet", "Broadband", { mood: "necessary", recurring: true }),
  ]

  const loans: Loan[] = [
    {
      id: id("loan"),
      direction: "borrowed",
      person: "Rakib (friend)",
      amount: 3000,
      date: toISODate(new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 8))),
      dueDate: toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 3)),
      reason: "Ran short before payday",
      amountRepaid: 1000,
      notes: "Repay after salary",
      createdAt: Date.now() - 8 * 86400000,
    },
    {
      id: id("loan"),
      direction: "borrowed",
      person: "Cousin Tanvir",
      amount: 1500,
      date: toISODate(new Date(now.getFullYear(), now.getMonth() - 1, 20)),
      dueDate: toISODate(new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 2))),
      reason: "Medical emergency",
      amountRepaid: 1500,
      notes: "",
      createdAt: Date.now() - 20 * 86400000,
    },
    {
      id: id("loan"),
      direction: "lent",
      person: "Sabbir",
      amount: 500,
      date: toISODate(new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 5))),
      dueDate: toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 10)),
      reason: "Lunch money",
      amountRepaid: 0,
      notes: "",
      createdAt: Date.now() - 5 * 86400000,
    },
  ]

  const budgets: Record<string, number> = {
    food: 3000,
    transport: 1500,
    shopping: 1000,
    parents: 2000,
    entertainment: 800,
    gifts: 1000,
  }

  return {
    version: 1,
    settings: {
      salary: 16000,
      salaryDate: salaryDay,
      currency: "BDT",
      currencySymbol: "৳",
    },
    categories: DEFAULT_CATEGORIES,
    transactions: transactions.sort((a, b) => b.createdAt - a.createdAt),
    loans,
    budgets,
    quickAddPresets: DEFAULT_QUICK_ADD_PRESETS.map((p) => ({ ...p })),
  }
}

export function emptyData(): AppData {
  return {
    version: 1,
    settings: { salary: 16000, salaryDate: 1, currency: "BDT", currencySymbol: "৳" },
    categories: DEFAULT_CATEGORIES,
    transactions: [],
    loans: [],
    budgets: {},
    quickAddPresets: DEFAULT_QUICK_ADD_PRESETS.map((p) => ({ ...p })),
  }
}
