"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useStore } from "@/lib/store"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"

interface NavItem {
  href: string
  label: string
  icon: string
}

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/transactions", label: "Transactions", icon: "receipt-text" },
  { href: "/budgets", label: "Budgets", icon: "target" },
  { href: "/goals", label: "Savings Goals", icon: "trophy" },
  { href: "/borrowed", label: "Borrowed", icon: "hand-coins" },
  { href: "/insights", label: "Insights", icon: "sparkles" },
  { href: "/categories", label: "Categories", icon: "shapes" },
  { href: "/settings", label: "Settings", icon: "settings" },
]

const MOBILE_NAV = NAV.slice(0, 5)

interface UIContextValue {
  openAdd: () => void
  openEdit: (tx: Transaction) => void
}

const UIContext = React.createContext<UIContextValue | null>(null)

export function useUI() {
  const ctx = React.useContext(UIContext)
  if (!ctx) throw new Error("useUI must be used within AppShell")
  return ctx
}

function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <Icon name={resolved === "dark" ? "sun" : "moon"} className="size-4" />
    </Button>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Logo"
        width={180}
        height={48}
        className="h-11 w-auto object-contain"
        priority
      />
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { hydrated } = useStore()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Transaction | null>(null)

  const ui = React.useMemo<UIContextValue>(
    () => ({
      openAdd: () => {
        setEditing(null)
        setDialogOpen(true)
      },
      openEdit: (tx: Transaction) => {
        setEditing(tx)
        setDialogOpen(true)
      },
    }),
    [],
  )

  const activeLabel = NAV.find((n) => n.href === pathname)?.label ?? "Dashboard"

  return (
    <UIContext.Provider value={ui}>
      <div className="min-h-svh bg-background">

        {/* ── Sidebar (desktop) ── */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-[#FAF8F3] dark:bg-sidebar px-3 py-5 lg:flex">
          <div className="px-2 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <Brand />
          </div>

          <nav className="mt-4 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = item.href === pathname
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px]",
                    active
                      ? "bg-[#FFC700] text-black font-extrabold"
                      : "text-neutral-600 dark:text-muted-foreground hover:bg-white dark:hover:bg-muted hover:text-neutral-900 dark:hover:text-foreground",
                  )}
                >
                  <Icon name={item.icon} className="size-4.5 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar footer tip */}
          <div className="mt-auto rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-muted p-3 space-y-1">
            <p className="text-xs font-extrabold text-neutral-800 dark:text-foreground">Spend with intention</p>
            <p className="text-[11px] text-neutral-500 dark:text-muted-foreground text-pretty leading-relaxed">
              Every taka you track is a step toward financial calm.
            </p>
          </div>
        </aside>

        {/* ── Main column ── */}
        <div className="lg:pl-60">
          {/* Top header bar */}
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF8F3]/90 dark:bg-background/90 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              <span className="lg:hidden">
                <Brand />
              </span>
              <h1 className="hidden font-serif text-base font-extrabold text-neutral-900 dark:text-foreground lg:block">
                {activeLabel}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Search / command */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandOpen(true)}
                className="hidden sm:flex"
              >
                <Icon name="search" className="size-3.5" />
                <span>Search</span>
                <kbd className="rounded bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 text-[10px] font-mono border border-neutral-200 dark:border-neutral-600">
                  ⌘K
                </kbd>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCommandOpen(true)}
                className="flex sm:hidden"
                aria-label="Search"
              >
                <Icon name="search" className="size-4" />
              </Button>

              <ThemeToggle />

              <Button onClick={ui.openAdd} size="sm">
                <Icon name="plus" className="size-3.5" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
            {hydrated ? children : <LoadingScreen />}
          </main>
        </div>

        {/* ── Bottom nav (mobile) ── */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 bg-[#FAF8F3]/95 dark:bg-background/95 px-2 py-1.5 backdrop-blur-md lg:hidden">
          {MOBILE_NAV.map((item) => {
            const active = item.href === pathname
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 px-1 py-1.5 text-[11px] font-semibold transition-colors rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px]",
                  active
                    ? "text-black bg-[#FFC700] font-bold"
                    : "text-neutral-500 dark:text-muted-foreground",
                )}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onOpenAdd={ui.openAdd} />
      </div>
    </UIContext.Provider>
  )
}

function LoadingScreen() {
  return (
    <div className="grid gap-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-neutral-200 dark:bg-muted" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </div>
  )
}
