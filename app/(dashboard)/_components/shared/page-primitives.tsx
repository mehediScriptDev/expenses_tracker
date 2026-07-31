import * as React from "react"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { formatMoney, formatDate } from "@/lib/format"

type StatTone = "default" | "success" | "danger" | "accent" | "warning"

const valueTone: Record<StatTone, string> = {
  default: "text-slate-900 dark:text-slate-100",
  success: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-200/70 dark:ring-emerald-800/60 px-2 py-0.5 rounded-md",
  danger: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 ring-1 ring-rose-200/70 dark:ring-rose-800/60 px-2 py-0.5 rounded-md",
  accent: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 ring-1 ring-blue-200/70 dark:ring-blue-800/60 px-2 py-0.5 rounded-md",
  warning: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 ring-1 ring-amber-200/70 dark:ring-amber-800/60 px-2 py-0.5 rounded-md",
}

export function StatTile({
  icon,
  label,
  value,
  subtext,
  tone = "default",
  className,
}: {
  icon: string
  label: string
  value: React.ReactNode
  subtext?: string
  tone?: StatTone
  className?: string
}) {
  return (
    <div className={cn("rounded-xl bg-white dark:bg-slate-900 px-3.5 py-3.5 shadow-2xs border border-neutral-200/60 dark:border-neutral-800 sm:px-4 sm:py-4 transition-all", className)}>
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icon name={icon} className="size-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className={cn("mt-2 font-mono text-lg font-extrabold tabular-nums sm:text-xl", valueTone[tone])}>{value}</p>
      {subtext ? <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{subtext}</p> : null}
    </div>
  )
}

export function StatGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4", className)}>{children}</div>
}

export function SummaryBar({
  items,
  className,
}: {
  items: Array<{ label: string; value: React.ReactNode; tone?: StatTone }>
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-white dark:bg-card border border-neutral-200/60 dark:border-neutral-800 px-4 py-3 text-sm shadow-2xs sm:gap-x-6 sm:px-5 sm:py-3.5",
        className,
      )}
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</span>
          <span className={cn("font-mono font-extrabold tabular-nums text-sm sm:text-base", valueTone[item.tone ?? "default"])}>
            {item.value}
          </span>
        </span>
      ))}
    </div>
  )
}

export function FilterToolbar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3", className)}>
      {children}
    </div>
  )
}

export function DateGroupHeader({
  date,
  income,
  expense,
  currencySymbol,
}: {
  date: string
  income: number
  expense: number
  currencySymbol: string
  count?: number
}) {
  const parts: string[] = []
  if (income > 0) parts.push(`+${formatMoney(income, { symbol: currencySymbol })}`)
  if (expense > 0) parts.push(`-${formatMoney(expense, { symbol: currencySymbol })}`)

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-(--dash-border) pb-2">
      <h3 className="text-sm font-semibold text-(--dash-text)">{formatDate(date, "medium")}</h3>
      {parts.length > 0 ? (
        <p className="font-mono text-xs font-semibold tabular-nums text-(--dash-text-muted)">{parts.join(" · ")}</p>
      ) : null}
    </div>
  )
}

export function StatusBadge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: React.ReactNode
  tone?: "success" | "danger" | "warning" | "neutral" | "accent"
  icon?: string
  className?: string
}) {
  const toneClass = {
    success: "bg-(--dash-success-soft) text-(--dash-income)",
    danger: "bg-(--dash-danger-soft) text-(--dash-expense)",
    warning: "bg-(--dash-warning-soft) text-warning",
    neutral: "bg-(--dash-muted) text-(--dash-text-secondary)",
    accent: "bg-(--dash-accent-soft) text-(--dash-accent)",
  }[tone]

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", toneClass, className)}>
      {icon ? <Icon name={icon} className="size-3" aria-hidden /> : null}
      {children}
    </span>
  )
}

export function PageHero({
  label,
  value,
  caption,
  action,
  children,
  className,
}: {
  label: string
  value: React.ReactNode
  caption?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("dash-hero", className)}>
      <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="dash-label">{label}</p>
          <p className="dash-hero-value">{value}</p>
          {caption ? <div className="dash-caption max-w-xl">{caption}</div> : null}
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
      </div>
      {children ? <div className="mt-4 border-t border-(--dash-border) pt-4 sm:mt-5 sm:pt-5">{children}</div> : null}
    </section>
  )
}
