"use client"

import Link from "next/link"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { dashCaption } from "@/dashboard/shared"
import type { Insight } from "@/types"
import { alertRowClass, alertToneIcon } from "./alert-tokens"

type AlertRowProps = {
  alert: Pick<Insight, "icon" | "title" | "detail" | "tone">
  href?: string
  unread?: boolean
  onNavigate?: () => void
}

export function AlertRow({ alert, href, unread, onNavigate }: AlertRowProps) {
  const body = (
    <>
      <Icon
        name={alert.icon}
        className={cn("mt-0.5 size-5 shrink-0", alertToneIcon[alert.tone])}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1A1A1A] dark:text-foreground">{alert.title}</p>
        {alert.detail ? (
          <p className={cn(dashCaption, "mt-1 text-pretty")}>{alert.detail}</p>
        ) : null}
      </div>
      {href ? (
        <Icon
          name="chevron-right"
          className="mt-0.5 size-4 shrink-0 text-[#5C5955] dark:text-muted-foreground"
          aria-hidden
        />
      ) : null}
    </>
  )

  const className = alertRowClass(alert.tone, unread)

  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className={cn(className, "hover:brightness-[0.98]")}>
        {body}
      </Link>
    )
  }

  return <div className={className}>{body}</div>
}
