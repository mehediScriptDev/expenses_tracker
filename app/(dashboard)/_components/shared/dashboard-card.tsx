import * as React from "react"
import { cn } from "@/lib/utils"

export const dashCard = "dash-card"
export const dashMuted = "dash-muted"
export const dashSegment = "dash-segment"
export const dashSegmentItem = "dash-segment-item"
export const dashSegmentItemActive = "dash-segment-item dash-segment-item-active"
export const dashLabel = "dash-label"
export const dashCaption = "dash-caption"
export const dashMeta = "dash-meta"
export const dashLink = "dash-link"
export const dashInput = "dash-input"
export const dashStatValue = "dash-stat-value"
export const dashHeroValue = "dash-hero-value"
export const dashSectionTitle = "dash-section-title"

interface DashboardCardProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  description?: string
}

export function DashboardCard({
  title,
  action,
  children,
  className,
  bodyClassName,
  description,
}: DashboardCardProps) {
  return (
    <section className={cn(dashCard, className)}>
      {title || description || action ? (
        <div className="flex items-start justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 space-y-1">
            {title ? <h2 className={dashSectionTitle}>{title}</h2> : null}
            {description ? <p className={dashCaption}>{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn("px-5 pb-5 pt-0 sm:px-6 sm:pb-6", bodyClassName)}>{children}</div>
    </section>
  )
}
