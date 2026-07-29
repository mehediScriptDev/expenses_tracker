"use client"

import * as React from "react"
import { STORAGE_KEY, DEFAULT_QUICK_ADD_PRESETS } from "./constants"
import { buildSeedData, emptyData } from "./seed"
import type {
  AppData,
  Budgets,
  Category,
  Loan,
  QuickAddPreset,
  Settings,
  Transaction,
} from "@/types"

function uid(prefix = "tx") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`
}

function normalizeData(raw: AppData): AppData {
  return {
    ...raw,
    categories: (raw.categories ?? []).map((c) => ({
      ...c,
      color: c.color === "var(--chart-1)" ? "var(--chart-4)" : c.color,
    })),
    quickAddPresets:
      Array.isArray(raw.quickAddPresets) && raw.quickAddPresets.length > 0
        ? raw.quickAddPresets
        : DEFAULT_QUICK_ADD_PRESETS.map((p) => ({ ...p })),
  }
}

function load(): AppData {
  if (typeof window === "undefined") return emptyData()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = buildSeedData()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    return normalizeData(JSON.parse(raw) as AppData)
  } catch {
    return buildSeedData()
  }
}

interface DeletedTx {
  tx: Transaction
  index: number
}

interface StoreValue {
  data: AppData
  hydrated: boolean
  // transactions
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt">) => Transaction
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  duplicateTransaction: (id: string) => void
  undoDelete: () => void
  canUndo: boolean
  // categories
  addCategory: (cat: Omit<Category, "id" | "isCustom">) => void
  updateCategory: (id: string, patch: Partial<Category>) => void
  deleteCategory: (id: string) => void
  // loans
  addLoan: (loan: Omit<Loan, "id" | "createdAt">) => void
  updateLoan: (id: string, patch: Partial<Loan>) => void
  deleteLoan: (id: string) => void
  // budgets & settings
  setBudget: (categoryId: string, amount: number) => void
  removeBudget: (categoryId: string) => void
  setBudgets: (b: Budgets) => void
  updateSettings: (patch: Partial<Settings>) => void
  // quick add presets
  addQuickAddPreset: (preset: Omit<QuickAddPreset, "id">) => void
  updateQuickAddPreset: (id: string, patch: Partial<QuickAddPreset>) => void
  deleteQuickAddPreset: (id: string) => void
  // data mgmt
  replaceAll: (data: AppData) => void
  resetAll: () => void
  loadDemo: () => void
}

const StoreContext = React.createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AppData>(emptyData)
  const [hydrated, setHydrated] = React.useState(false)
  const lastDeleted = React.useRef<DeletedTx | null>(null)
  const [canUndo, setCanUndo] = React.useState(false)

  React.useEffect(() => {
    setData(load())
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* ignore quota errors */
    }
  }, [data, hydrated])

  const value = React.useMemo<StoreValue>(() => {
    return {
      data,
      hydrated,
      canUndo,
      addTransaction: (tx) => {
        const full: Transaction = { ...tx, id: uid(), createdAt: Date.now() }
        setData((d) => ({ ...d, transactions: [full, ...d.transactions] }))
        return full
      },
      updateTransaction: (id, patch) =>
        setData((d) => ({
          ...d,
          transactions: d.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),
      deleteTransaction: (id) =>
        setData((d) => {
          const index = d.transactions.findIndex((t) => t.id === id)
          if (index >= 0) {
            lastDeleted.current = { tx: d.transactions[index], index }
            setCanUndo(true)
          }
          return {
            ...d,
            transactions: d.transactions.filter((t) => t.id !== id),
          }
        }),
      duplicateTransaction: (id) =>
        setData((d) => {
          const src = d.transactions.find((t) => t.id === id)
          if (!src) return d
          const copy: Transaction = {
            ...src,
            id: uid(),
            createdAt: Date.now(),
            description: `${src.description} (copy)`,
          }
          return { ...d, transactions: [copy, ...d.transactions] }
        }),
      undoDelete: () => {
        const del = lastDeleted.current
        if (!del) return
        setData((d) => {
          const next = [...d.transactions]
          next.splice(Math.min(del.index, next.length), 0, del.tx)
          return { ...d, transactions: next }
        })
        lastDeleted.current = null
        setCanUndo(false)
      },
      addCategory: (cat) =>
        setData((d) => ({
          ...d,
          categories: [
            ...d.categories,
            { ...cat, id: uid("cat"), isCustom: true },
          ],
        })),
      updateCategory: (id, patch) =>
        setData((d) => ({
          ...d,
          categories: d.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        })),
      deleteCategory: (id) =>
        setData((d) => {
          const { [id]: _removed, ...rest } = d.budgets
          return {
            ...d,
            categories: d.categories.filter((c) => c.id !== id),
            budgets: rest,
            transactions: d.transactions.map((t) =>
              t.categoryId === id ? { ...t, categoryId: "other" } : t,
            ),
          }
        }),
      addLoan: (loan) =>
        setData((d) => ({
          ...d,
          loans: [{ ...loan, id: uid("loan"), createdAt: Date.now() }, ...d.loans],
        })),
      updateLoan: (id, patch) =>
        setData((d) => ({
          ...d,
          loans: d.loans.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      deleteLoan: (id) =>
        setData((d) => ({ ...d, loans: d.loans.filter((l) => l.id !== id) })),
      setBudget: (categoryId, amount) =>
        setData((d) => ({
          ...d,
          budgets: { ...d.budgets, [categoryId]: amount },
        })),
      removeBudget: (categoryId) =>
        setData((d) => {
          const { [categoryId]: _r, ...rest } = d.budgets
          return { ...d, budgets: rest }
        }),
      setBudgets: (b) => setData((d) => ({ ...d, budgets: b })),
      updateSettings: (patch) =>
        setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      addQuickAddPreset: (preset) =>
        setData((d) => ({
          ...d,
          quickAddPresets: [...d.quickAddPresets, { ...preset, id: uid("qa") }],
        })),
      updateQuickAddPreset: (id, patch) =>
        setData((d) => ({
          ...d,
          quickAddPresets: d.quickAddPresets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteQuickAddPreset: (id) =>
        setData((d) => ({
          ...d,
          quickAddPresets: d.quickAddPresets.filter((p) => p.id !== id),
        })),
      replaceAll: (next) => setData(normalizeData(next)),
      resetAll: () => setData(emptyData()),
      loadDemo: () => setData(buildSeedData()),
    }
  }, [data, hydrated, canUndo])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
