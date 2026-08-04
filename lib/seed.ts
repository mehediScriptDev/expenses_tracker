import { DEFAULT_CATEGORIES, DEFAULT_QUICK_ADD_PRESETS } from "./constants"
import { toISODate } from "./format"
import type { AppData, Loan, Transaction } from "@/types"

let counter = 0
function id(prefix = "t") {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter}`
}

function makeDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day)
}

function makeTxOnDate(
  date: Date,
  amount: number,
  categoryId: string,
  description: string,
  extra: Partial<Transaction> = {},
): Transaction {
  return {
    id: id(),
    type: extra.type ?? "expense",
    amount,
    categoryId,
    description,
    date: toISODate(date),
    time: extra.time ?? "13:30",
    paymentMethod: extra.paymentMethod ?? "cash",
    merchant: extra.merchant,
    location: extra.location,
    notes: extra.notes,
    mood: extra.mood,
    tags: extra.tags ?? [],
    recurring: extra.recurring ?? false,
    createdAt: date.getTime(),
  }
}

export function buildSeedData(): AppData {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() 

  const transactions: Transaction[] = []

 
  const monthlyExpenses = (year: number, month: number): Transaction[] => {
    const txs: Transaction[] = []

   
    txs.push({
      id: id(),
      type: "income",
      amount: 16000,
      categoryId: "salary",
      description: "Monthly salary",
      date: toISODate(makeDate(year, month, 1)),
      time: "10:00",
      paymentMethod: "bank",
      merchant: "Employer",
      tags: ["salary"],
      recurring: true,
      createdAt: makeDate(year, month, 1).getTime(),
    })

    txs.push(makeTxOnDate(makeDate(year, month, 2), 120, "food", "Lunch at campus", { merchant: "Canteen", mood: "necessary", paymentMethod: "cash", time: "13:15" }))
    txs.push(makeTxOnDate(makeDate(year, month, 5), 350 + (month * 10), "food", "Groceries", { merchant: "Shwapno", mood: "necessary", paymentMethod: "bkash" }))
    txs.push(makeTxOnDate(makeDate(year, month, 14), 180 + (month * 5), "food", "Dinner out", { merchant: "Sultan's Dine", mood: "luxury" }))
    txs.push(makeTxOnDate(makeDate(year, month, 20), 80, "food", "Tea & snacks", { mood: "happy", time: "16:00" }))

    
    txs.push(makeTxOnDate(makeDate(year, month, 3), 60, "transport", "Bus to office", { mood: "necessary", paymentMethod: "cash", time: "09:00" }))
    txs.push(makeTxOnDate(makeDate(year, month, 10), 150, "fuel", "Bike fuel", { mood: "necessary" }))
    txs.push(makeTxOnDate(makeDate(year, month, 22), 90, "transport", "Rickshaw", { mood: "necessary" }))

  
    txs.push(makeTxOnDate(makeDate(year, month, 4), 200, "internet", "Broadband bill", { merchant: "Link3", mood: "necessary", recurring: true, paymentMethod: "bkash" }))

   
    txs.push(makeTxOnDate(makeDate(year, month, 6), 1500, "parents", "Sent to parents", { mood: "necessary", paymentMethod: "bkash", tags: ["family"] }))

   
    if (month % 2 === 0) {
      txs.push(makeTxOnDate(makeDate(year, month, 12), 500 + (month * 20), "shopping", "Clothing purchase", { merchant: "Aarong", mood: "regret", paymentMethod: "card" }))
    } else {
      txs.push(makeTxOnDate(makeDate(year, month, 16), 300, "shopping", "Household items", { merchant: "Daraz", mood: "necessary", paymentMethod: "bkash" }))
    }

  
    txs.push(makeTxOnDate(makeDate(year, month, 18), 250 + (month * 8), "entertainment", "Movie night", { merchant: "Star Cineplex", mood: "happy", paymentMethod: "card" }))

   
    txs.push(makeTxOnDate(makeDate(year, month, 7), 999, "subscriptions", "Phone recharge + Netflix", { mood: "luxury", recurring: true, paymentMethod: "card" }))

 
    if (month % 3 === 0) {
      txs.push(makeTxOnDate(makeDate(year, month, 15), 400, "medical", "Medicine", { merchant: "Lazz Pharma", mood: "necessary", paymentMethod: "bkash" }))
    }

   
    if (month === 1 || month === 3 || month === 11) {
      txs.push(makeTxOnDate(makeDate(year, month, 13), 800, "gifts", "Special gift", { mood: "happy", paymentMethod: "card" }))
    }

    
    if (month <= 2) {
      txs.push(makeTxOnDate(makeDate(year, month, 8), 300, "university", "Semester supplies", { mood: "necessary" }))
    }

    
    if (month === 2 || month === 5 || month === 8) {
      txs.push({
        id: id(),
        type: "income",
        amount: 4500,
        categoryId: "freelance",
        description: "Freelance project payment",
        date: toISODate(makeDate(year, month, 25)),
        time: "14:00",
        paymentMethod: "bkash",
        tags: ["freelance"],
        recurring: false,
        createdAt: makeDate(year, month, 25).getTime(),
      })
    }

    return txs
  }

  
  for (let m = 0; m <= currentMonth; m++) {
    const entries = monthlyExpenses(currentYear, m)

   
    if (m === currentMonth) {
      const today = now.getDate()
      entries.forEach((tx) => {
        const txDay = new Date(tx.date).getDate()
        if (txDay <= today) transactions.push(tx)
      })
    } else {
      transactions.push(...entries)
    }
  }

  const loans: Loan[] = [
    {
      id: id("loan"),
      direction: "borrowed",
      person: "Rakib (friend)",
      amount: 3000,
      date: toISODate(new Date(currentYear, currentMonth, Math.max(1, now.getDate() - 8))),
      dueDate: toISODate(new Date(currentYear, currentMonth + 1, 3)),
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
      date: toISODate(new Date(currentYear, currentMonth - 1, 20)),
      dueDate: toISODate(new Date(currentYear, currentMonth, Math.max(1, now.getDate() - 2))),
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
      date: toISODate(new Date(currentYear, currentMonth, Math.max(1, now.getDate() - 5))),
      dueDate: toISODate(new Date(currentYear, currentMonth + 1, 10)),
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

  const demo = applyNotificationDemoScenario(
    { transactions, loans, budgets },
    now,
    currentYear,
    currentMonth,
  )

  return {
    version: 1,
    settings: {
      salary: 16000,
      salaryDate: 1,
      currency: "BDT",
      currencySymbol: "৳",
    },
    categories: DEFAULT_CATEGORIES,
    transactions: demo.transactions.sort((a, b) => b.createdAt - a.createdAt),
    loans: demo.loans,
    budgets: demo.budgets,
    quickAddPresets: DEFAULT_QUICK_ADD_PRESETS.map((p) => ({ ...p })),
  }
}

function applyNotificationDemoScenario(
  base: {
    transactions: Transaction[]
    loans: Loan[]
    budgets: Record<string, number>
  },
  now: Date,
  year: number,
  month: number,
): { transactions: Transaction[]; loans: Loan[]; budgets: Record<string, number> } {
  const transactions = [...base.transactions]
  const loans = base.loans.map((l) => ({ ...l }))
  const budgets = { ...base.budgets, food: 2800, shopping: 900, entertainment: 600 }

  const today = now.getDate()
  const day = (offset: number) => Math.max(1, Math.min(28, today + offset))

  transactions.push(
    makeTxOnDate(makeDate(year, month, day(-1)), 1400, "food", "Demo: big grocery restock", {
      merchant: "Meena Bazar",
      paymentMethod: "bkash",
    }),
  )
  transactions.push(
    makeTxOnDate(makeDate(year, month, day(-2)), 950, "food", "Demo: family dinner", {
      mood: "happy",
      paymentMethod: "card",
    }),
  )
  transactions.push(
    makeTxOnDate(makeDate(year, month, day(-3)), 720, "shopping", "Demo: online order", {
      merchant: "Daraz",
      paymentMethod: "bkash",
    }),
  )

  for (let i = 0; i < 4; i++) {
    transactions.push(
      makeTxOnDate(makeDate(year, month, day(-i)), 380 + i * 40, "entertainment", "Demo: this week spend", {
        paymentMethod: "cash",
      }),
    )
  }
  transactions.push(
    makeTxOnDate(makeDate(year, month, day(-9)), 120, "transport", "Demo: light day last week", {
      paymentMethod: "cash",
    }),
  )

  transactions.push(
    makeTxOnDate(makeDate(year, month, day(-4)), 1100, "parents", "Demo: extra support", {
      paymentMethod: "bkash",
    }),
  )

  const tanvir = loans.find((l) => l.person.includes("Tanvir"))
  if (tanvir) {
    tanvir.amountRepaid = 400
    tanvir.dueDate = toISODate(makeDate(year, month, day(-6)))
  }

  loans.push({
    id: id("loan"),
    direction: "borrowed",
    person: "Office friend (demo)",
    amount: 1200,
    date: toISODate(makeDate(year, month, day(-5))),
    dueDate: toISODate(makeDate(year, month + 1, 12)),
    reason: "Short before weekend",
    amountRepaid: 0,
    notes: "Demo notification",
    createdAt: now.getTime() - 5 * 86400000,
  })

  return { transactions, loans, budgets }
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
