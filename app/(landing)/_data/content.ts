export interface FaqItem {
  id: number
  q: string
  a: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 0,
    q: "How do I track daily expenses on Gorib Manush?",
    a: "Simply tap 'Add Expense' or use the quick preset chips (Food, Transport, Groceries) to log any purchase in seconds. Gorib Manush automatically calculates your daily spending pace.",
  },
  {
    id: 1,
    q: "What payment methods and currencies are supported?",
    a: "Gorib Manush supports BDT (৳), USD ($), EUR (€), GBP (£), INR (₹), and all major world currencies with customizable currency symbols.",
  },
  {
    id: 2,
    q: "How does the safe daily spending limit work?",
    a: "Gorib Manush divides your remaining salary for the cycle by the number of days left until payday, giving you a clear, safe daily limit.",
  },
  {
    id: 3,
    q: "Will I receive reminders for upcoming loan payments?",
    a: "Yes! Gorib Manush flags overdue and upcoming loan due dates right on your dashboard so you never miss a repayment.",
  },
  {
    id: 4,
    q: "Can I export my transaction reports?",
    a: "Absolutely. You can export all your financial transactions to CSV or JSON format anytime from the Settings page.",
  },
  {
    id: 5,
    q: "Is my financial data stored privately?",
    a: "100% yes. All your financial data stays encrypted directly inside your local browser storage. No server uploads or tracking.",
  },
]

export const PARTNER_LOGOS = [
  "Mak tech",
  "Wishper Wall",
  "Shikkhaloy",
  "Artisan",
  "Logicnest",
] as const
