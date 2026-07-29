"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { usePathname } from "next/navigation"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { TransactionDialog } from "@/dashboard/transactions/transaction-dialog"
import { CommandPalette } from "@/dashboard/layout/command-palette"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types"
import { MAIN_NAV, MOBILE_NAV } from "@/config/navigation"

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

function UserMenu() {
  const router = useRouter()
  const { logout } = useAuth()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="User Menu"
        className="flex h-9 items-center gap-1 rounded-full border border-neutral-300 bg-[#EBF3FA] px-3 font-mono font-bold text-xs text-[#2B4C7E] shadow-2xs hover:bg-[#DEEBF7] transition-all cursor-pointer"
      >
        <span>AA</span>
        <Icon name={open ? "chevron-up" : "chevron-down"} className="size-3 text-[#2B4C7E]" />
      </button>

      {open && (
        <div 
          className="absolute right-0 mt-2 w-52 rounded-md border border-neutral-300 bg-white p-4 shadow-lg z-50 font-mono text-xs text-neutral-800 text-left animate-in fade-in zoom-in-95 duration-100"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="space-y-3">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="block font-medium text-neutral-800 hover:text-black transition-colors"
            >
              Account Settings
            </Link>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block font-medium text-neutral-800 hover:text-black transition-colors"
            >
              Home Page
            </Link>

            <div className="border-t border-neutral-200 pt-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout()
                  router.push("/")
                }}
                className="block w-full text-left font-medium text-neutral-700 hover:text-black transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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

  const activeLabel = MAIN_NAV.find((n) => n.href === pathname)?.label ?? "Dashboard"

  return (
    <UIContext.Provider value={ui}>
      <div className="min-h-svh bg-background">

        {/* ── Sidebar (desktop) ── */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-[#FAF8F3] dark:bg-sidebar px-3 py-5 lg:flex">
          <div className="px-2 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <Brand />
          </div>

          <nav className="mt-4 flex flex-1 flex-col gap-1">
            {MAIN_NAV.map((item) => {
              const active = item.href === pathname
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all rounded-tl-lg rounded-tr-[12px] rounded-br-none rounded-bl-[14px]",
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
              <UserMenu />
            </div>
          </header>

          <main className="w-full px-4 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-10">
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
                  "flex flex-1 flex-col items-center gap-0.5 px-1 py-1.5 text-[11px] font-semibold transition-colors rounded-tl-lg rounded-tr-[12px] rounded-br-none rounded-bl-[14px]",
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
