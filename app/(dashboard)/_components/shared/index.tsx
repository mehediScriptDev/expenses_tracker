import * as React from "react"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

export {
  DashboardCard,
  dashCard,
  dashMuted,
  dashSegment,
  dashSegmentItem,
  dashSegmentItemActive,
  dashLabel,
  dashCaption,
  dashMeta,
  dashLink,
  dashInput,
  dashStatValue,
  dashHeroValue,
  dashSectionTitle,
} from "./dashboard-card"

export {
  StatTile,
  StatGrid,
  SummaryBar,
  FilterToolbar,
  DateGroupHeader,
  StatusBadge,
  PageHero,
} from "./page-primitives"

/* ------------------------- ProgressBar ------------------------- */

export type Tone = "primary" | "accent" | "success" | "warning" | "danger" | "muted"

const toneBar: Record<Tone, string> = {
  primary: "bg-[#141414]",
  accent: "bg-[var(--dash-progress)]",
  success: "bg-[var(--dash-income)]",
  warning: "bg-warning",
  danger: "bg-[var(--dash-expense)]",
  muted: "bg-[var(--dash-text-faint)]",
}

export function ProgressBar({
  value,
  tone = "accent",
  className,
  trackClassName,
}: {
  value: number
  tone?: Tone
  className?: string
  trackClassName?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-(--dash-muted) ring-1 ring-(--dash-border)", trackClassName, className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneBar[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ------------------------- EmptyState ------------------------- */

export function EmptyState({
  icon = "sparkles",
  title,
  message,
  action,
  className,
}: {
  icon?: string
  title: string
  message?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl bg-(--dash-accent-soft)/35 px-4 py-10 text-center ring-1 ring-(--dash-border) sm:px-6 sm:py-14",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-(--dash-surface) text-(--dash-accent) shadow-sm ring-1 ring-(--dash-border)">
        <Icon name={icon} className="size-7" />
      </div>
      <div className="space-y-2">
        <p className="text-base font-semibold text-(--dash-text) text-balance">{title}</p>
        {message ? (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-(--dash-text-secondary) text-pretty">{message}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

/* ------------------------- PageHeader ------------------------- */

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="dash-page-header mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="dash-page-title">{title}</h1>
        {description ? <p className="dash-page-desc">{description}</p> : null}
      </div>
      {children ? (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">{children}</div>
      ) : null}
    </div>
  )
}

export function DashPage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("dash-page", className)}>{children}</div>
}

/* ------------------------- CategoryDot ------------------------- */

export function CategoryBadge({
  icon,
  color,
  name,
  size = "md",
}: {
  icon: string
  color: string
  name?: string
  size?: "sm" | "md" | "lg"
}) {
  const box = size === "sm" ? "size-8" : size === "lg" ? "size-11" : "size-9"
  const ic = size === "sm" ? "size-4" : size === "lg" ? "size-5" : "size-4"
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={cn("inline-flex items-center justify-center rounded-lg ring-1 ring-black/5", box)}
        style={{
          backgroundColor: `color-mix(in oklch, ${color} 32%, white)`,
          color: `color-mix(in oklch, ${color} 85%, black)`,
        }}
      >
        <Icon name={icon} className={ic} />
      </span>
      {name ? <span className="text-sm font-semibold text-(--dash-text)">{name}</span> : null}
    </span>
  )
}
