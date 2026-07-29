export type TransactionType = "expense" | "income"

export type Mood = "happy" | "regret" | "necessary" | "luxury"

export type PaymentMethod =
  | "cash"
  | "bkash"
  | "nagad"
  | "card"
  | "bank"
  | "rocket"
  | "other"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  /** ISO date string: YYYY-MM-DD */
  date: string
  /** HH:mm 24h */
  time: string
  paymentMethod: PaymentMethod
  merchant?: string
  location?: string
  notes?: string
  mood?: Mood
  tags: string[]
  recurring: boolean
  createdAt: number
}

export type CategoryKind = "expense" | "income"

export interface Category {
  id: string
  name: string
  /** lucide icon key, see lib/icons */
  icon: string
  /** css color token, e.g. "var(--chart-1)" or a raw oklch */
  color: string
  kind: CategoryKind
  isCustom: boolean
}

export type LoanDirection = "borrowed" | "lent"

export interface Loan {
  id: string
  direction: LoanDirection
  person: string
  amount: number
  /** ISO date */
  date: string
  dueDate?: string
  reason?: string
  amountRepaid: number
  notes?: string
  createdAt: number
}

export interface Settings {
  salary: number
  /** day of month salary lands, 1-28 */
  salaryDate: number
  currency: string
  currencySymbol: string
}

export interface QuickAddPreset {
  id: string
  label: string
  icon: string
  amount: number
  categoryId: string
  paymentMethod: PaymentMethod
}

/** category id -> monthly budget amount */
export type Budgets = Record<string, number>

export interface AppData {
  version: number
  settings: Settings
  categories: Category[]
  transactions: Transaction[]
  loans: Loan[]
  budgets: Budgets
  quickAddPresets: QuickAddPreset[]
}
