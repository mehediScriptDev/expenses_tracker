import * as React from "react"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format"
import { formatDate } from "@/lib/format"

/* ------------------------- StatTile ------------------------- */

type StatTone = "default" | "success" | "danger" | "accent" | "warning"

const statToneStyles: Record<StatTone, { tile: string; icon: string; value: string }> = {
  default: {
    tile: "bg-[var(--dash-surface)] ring-[var(--dash-border)]",
    icon: "bg-[var(--dash-muted)] text-[var(--dash-text-secondary)]",
    value: "text-[var(--dash-text)]",
  },
  success: {
    tile: "bg-[var(--dash-surface)] ring-[var(--dash-success-soft)]",
    icon: "bg-[var(--dash-success-soft)] text-[var(--dash-income)]",
    value: "text-[var(--dash-income)]",
  },
  danger: {
    tile: "bg-[var(--dash-surface)] ring-[var(--dash-danger-soft)]",
    icon: "bg-[var(--dash-danger-soft)] text-[var(--dash-expense)]",
    value: "text-[var(--dash-expense)]",
  },
  accent: {
    tile: "bg-[var(--dash-surface)] ring-[var(--dash-accent-soft)]",
    icon: "bg-[var(--dash-accent-soft)] text-[var(--dash-accent)]",
    value: "text-[var(--dash-accent)]",
  },
  warning: {
    tile: "bg-[var(--dash-surface)] ring-[var(--dash-warning-soft)]",
    icon: "bg-[var(--dash-warning-soft)] text-warning",
    value: "text-warning",
  },
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
  const styles = statToneStyles[tone]
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-4 shadow-sm ring-1 sm:px-5 sm:py-5",
        styles.tile,
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", styles.icon)}>
          <Icon name={icon} className="size-4" aria-hidden />
        </span>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--dash-text-muted)]">{label}</p>
      </div>
      <p className={cn("mt-2.5 font-mono text-xl font-bold tabular-nums tracking-tight sm:text-2xl", styles.value)}>
        {value}
      </p>
      {subtext ? <p className="mt-1 text-xs text-[var(--dash-text-muted)]">{subtext}</p> : null}
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
  return (
    <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>
      {children}
    </div>
  )
}

/* ------------------------- FilterToolbar ------------------------- */

export function FilterToolbar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl bg-[var(--dash-muted)] p-3 ring-1 ring-[var(--dash-border)] sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------- DateGroupHeader ------------------------- */

export function DateGroupHeader({
  date,
  income,
  expense,
  currencySymbol,
  count,
}: {
  date: string
  income: number
  expense: number
  currencySymbol: string
  count?: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--dash-accent-soft)]/45 px-4 py-3 ring-1 ring-[var(--dash-border)]">
      <p className="text-sm font-bold text-[var(--dash-text)]">{formatDate(date, "long")}</p>
      {count !== undefined ? (
        <span className="rounded-md bg-[var(--dash-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--dash-text-secondary)] ring-1 ring-[var(--dash-border)]">
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      ) : null}
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {income > 0 ? (
          <span className="rounded-md bg-[var(--dash-success-soft)] px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-[var(--dash-income)] ring-1 ring-[var(--dash-success-soft)]">
            +{formatMoney(income, { symbol: currencySymbol })}
          </span>
        ) : null}
        {expense > 0 ? (
          <span className="rounded-md bg-[var(--dash-expense-soft)] px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-[var(--dash-expense)] ring-1 ring-[var(--dash-danger-soft)]">
            -{formatMoney(expense, { symbol: currencySymbol })}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------- StatusBadge ------------------------- */

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
    success: "bg-[var(--dash-success-soft)] text-[var(--dash-income)] ring-1 ring-[var(--dash-success-soft)]",
    danger: "bg-[var(--dash-danger-soft)] text-[var(--dash-expense)] ring-1 ring-[var(--dash-danger-soft)]",
    warning: "bg-[var(--dash-warning-soft)] text-[#a85a20] ring-1 ring-[var(--dash-warning-soft)]",
    neutral: "bg-[var(--dash-muted)] text-[var(--dash-text-secondary)] ring-1 ring-[var(--dash-border)]",
    accent: "bg-[var(--dash-accent-soft)] text-[var(--dash-accent)] ring-1 ring-[var(--dash-accent-soft)]",
  }[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        toneClass,
        className,
      )}
    >
      {icon ? <Icon name={icon} className="size-3" aria-hidden /> : null}
      {children}
    </span>
  )
}

/* ------------------------- PageHero ------------------------- */

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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="dash-label">{label}</p>
          <p className="dash-hero-value">{value}</p>
          {caption ? <div className="dash-caption max-w-xl">{caption}</div> : null}
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  )
}
