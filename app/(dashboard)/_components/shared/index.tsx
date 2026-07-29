import * as React from "react"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

/* ------------------------- ProgressBar ------------------------- */

export type Tone = "primary" | "success" | "warning" | "danger" | "muted"

const toneBar: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  muted: "bg-muted-foreground/40",
}

export function ProgressBar({
  value,
  tone = "primary",
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
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", trackClassName, className)}
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
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon name={icon} className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-balance">{title}</p>
        {message ? (
          <p className="mx-auto max-w-xs text-sm text-muted-foreground text-pretty">{message}</p>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  )
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
  const box = size === "sm" ? "size-7" : size === "lg" ? "size-11" : "size-9"
  const ic = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4"
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn("inline-flex items-center justify-center rounded-lg", box)}
        style={{ backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
      >
        <Icon name={icon} className={ic} />
      </span>
      {name ? <span className="font-medium">{name}</span> : null}
    </span>
  )
}
