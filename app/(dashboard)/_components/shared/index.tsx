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

export { Pagination } from "@/components/ui/pagination"

/* ------------------------- ProgressBar ------------------------- */

export type Tone = "primary" | "accent" | "success" | "warning" | "danger" | "muted"

const toneBar: Record<Tone, string> = {
  primary: "bg-slate-900 dark:bg-slate-100",
  accent: "bg-blue-600 dark:bg-blue-500",
  success: "bg-emerald-600 dark:bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-600 dark:bg-rose-500",
  muted: "bg-slate-400",
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
      className={cn("h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80 ring-1 ring-black/5", trackClassName, className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500 shadow-2xs", toneBar[tone])}
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
        "flex flex-col items-center justify-center gap-4 rounded-xl bg-white dark:bg-card px-4 py-10 text-center border border-neutral-200/60 dark:border-neutral-800 shadow-2xs sm:px-6 sm:py-14",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-400 shadow-2xs">
        <Icon name={icon} className="size-7" />
      </div>
      <div className="space-y-2">
        <p className="text-base font-bold text-slate-900 dark:text-slate-100 text-balance">{title}</p>
        {message ? (
          <p className="mx-auto max-w-sm text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 text-pretty">{message}</p>
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
    <div className="dash-page-header mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="dash-page-title text-slate-900 dark:text-slate-50 font-extrabold">{title}</h1>
        {description ? <p className="dash-page-desc text-slate-500 dark:text-slate-400">{description}</p> : null}
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
  const box = size === "sm" ? "size-8 rounded-lg" : size === "lg" ? "size-11 rounded-xl" : "size-9 rounded-xl"
  const ic = size === "sm" ? "size-4" : size === "lg" ? "size-5" : "size-4.5"
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={cn("inline-flex items-center justify-center shadow-2xs", box)}
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 18%, white)`,
          color,
        }}
      >
        <Icon name={icon} className={ic} />
      </span>
      {name ? <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{name}</span> : null}
    </span>
  )
}
