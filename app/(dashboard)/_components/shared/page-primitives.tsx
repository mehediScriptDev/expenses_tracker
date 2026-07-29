import * as React from "react"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { formatMoney, formatDate } from "@/lib/format"

type StatTone = "default" | "success" | "danger" | "accent" | "warning"

const valueTone: Record<StatTone, string> = {
  default: "text-(--dash-text)",
  success: "text-(--dash-income)",
  danger: "text-(--dash-expense)",
  accent: "text-(--dash-accent)",
  warning: "text-warning",
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
    <div className={cn("rounded-xl bg-(--dash-surface) px-3 py-3 ring-1 ring-(--dash-border) sm:px-4 sm:py-3.5", className)}>
      <div className="flex items-center gap-2 text-(--dash-text-muted)">
        <Icon name={icon} className="size-3.5 shrink-0" aria-hidden />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className={cn("mt-1.5 font-mono text-lg font-bold tabular-nums sm:text-xl", valueTone[tone])}>{value}</p>
      {subtext ? <p className="mt-0.5 text-xs text-(--dash-text-faint)">{subtext}</p> : null}
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
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-(--dash-muted)/70 px-3 py-2.5 text-sm sm:gap-x-5 sm:px-4 sm:py-3",
        className,
      )}
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-baseline gap-1.5">
          <span className="text-(--dash-text-muted)">{item.label}</span>
          <span className={cn("font-mono font-bold tabular-nums", valueTone[item.tone ?? "default"])}>
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
