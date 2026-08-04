"use client"

import * as React from "react"
import Link from "next/link"
import { createPortal } from "react-dom"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import {
  formatNotificationTime,
  NOTIFICATION_PRESENTATION,
  type AppNotification,
} from "@/lib/notifications"
import { useNotificationInbox, type NotificationInbox } from "./use-notification-inbox"
import { headerActionClass, headerBadgeClass } from "@/dashboard/layout/header-action-button"
import { ModalBackdrop } from "@/components/ui/modal-overlay"

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return mobile
}

export function NotificationBell() {
  const inbox = useNotificationInbox()
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const isMobile = useIsMobile()
  const desktopRef = React.useRef<HTMLDivElement>(null)

  const close = () => setOpen(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (desktopRef.current?.contains(t)) return
      if ((e.target as HTMLElement).closest?.("[data-notification-sheet]")) return
      close()
    }

    const mq = window.matchMedia("(max-width: 1023px)")
    const prevOverflow = document.body.style.overflow
    if (mq.matches) document.body.style.overflow = "hidden"

    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [open])

  const unread = inbox.unreadCount

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
      aria-expanded={open}
      className={headerActionClass(open)}
    >
      <Icon name="bell" className="size-4.5 stroke-[2.25]" strokeWidth={2.25} />
      {unread > 0 ? (
        <span className={headerBadgeClass} aria-hidden>
          {unread > 9 ? "9+" : unread}
        </span>
      ) : null}
    </button>
  )

  return (
    <>
      <div ref={desktopRef} className="relative hidden lg:block">
        {trigger}
        {open ? (
          <NotificationPanel
            inbox={inbox}
            onClose={close}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[24rem] max-h-[min(32rem,75vh)]"
          />
        ) : null}
      </div>

      <div className="lg:hidden">{trigger}</div>

      {mounted && open && isMobile
        ? createPortal(<MobileNotificationSheet inbox={inbox} onClose={close} />, document.body)
        : null}
    </>
  )
}

function panelShell(className?: string) {
  return cn(
    "flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl",
    "dark:border-neutral-800 dark:bg-card",
    "animate-in fade-in zoom-in-95 duration-150",
    className,
  )
}

function NotificationPanel({
  inbox,
  onClose,
  className,
}: {
  inbox: NotificationInbox
  onClose: () => void
  className?: string
}) {
  return (
    <div role="dialog" aria-label="Notifications" className={panelShell(className)}>
      <PanelChrome inbox={inbox} onClose={onClose} showClose={false} />
    </div>
  )
}

function MobileNotificationSheet({
  inbox,
  onClose,
}: {
  inbox: NotificationInbox
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-100 lg:hidden" data-notification-sheet>
      <ModalBackdrop className="absolute inset-0" onDismiss={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col border-t border-neutral-200 bg-white shadow-2xl",
          "top-[calc(3.5rem+env(safe-area-inset-top,0px))]",
          "dark:border-neutral-800 dark:bg-card",
          "animate-in slide-in-from-bottom-3 duration-200",
          "pb-[env(safe-area-inset-bottom)]",
        )}
      >
        <PanelChrome inbox={inbox} onClose={onClose} showClose mobile />
      </div>
    </div>
  )
}

function PanelChrome({
  inbox,
  onClose,
  showClose,
  mobile,
}: {
  inbox: NotificationInbox
  onClose: () => void
  showClose?: boolean
  mobile?: boolean
}) {
  const { items, unreadCount, markAllRead, isUnread, markRead } = inbox
  const [, tick] = React.useReducer((n) => n + 1, 0)

  React.useEffect(() => {
    const id = window.setInterval(() => tick(), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-neutral-100 px-4 py-3 dark:border-neutral-800 sm:items-center sm:py-3.5">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Notifications</h2>
        <div className="flex shrink-0 items-center gap-1.5">
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex max-w-38 items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer sm:max-w-none sm:gap-1.5 sm:text-sm"
            >
              <Icon name="circle-check" className="size-3.5 shrink-0 sm:size-4" strokeWidth={2} />
              <span className="truncate">{mobile ? "Mark all read" : "Mark all as read"}</span>
            </button>
          ) : null}
          {showClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-muted"
            >
              <Icon name="x" className="size-4" />
            </button>
          ) : null}
        </div>
      </header>

      <div
        className={cn(
          "notification-panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain",
          mobile && "touch-pan-y",
        )}
      >
        {items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">No notifications yet.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                <NotificationRow
                  item={item}
                  unread={isUnread(item.id)}
                  onMarkRead={() => markRead(item.id)}
                  onClose={onClose}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function NotificationRow({
  item,
  unread,
  onMarkRead,
  onClose,
}: {
  item: AppNotification
  unread: boolean
  onMarkRead: () => void
  onClose: () => void
}) {
  const meta = NOTIFICATION_PRESENTATION[item.type]
  const timeLabel = formatNotificationTime(item.createdAt)

  return (
    <Link
      href={item.href}
      onClick={() => {
        if (unread) onMarkRead()
        onClose()
      }}
      className={cn(
        "flex gap-3 px-4 py-3.5 transition-colors active:bg-neutral-100/80",
        unread ? "bg-[#EFF6FF] hover:bg-[#E0EFFF]" : "bg-white hover:bg-neutral-50/80",
        "dark:hover:bg-muted/30",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          meta.iconWrap,
        )}
      >
        <Icon name={meta.icon} className="size-4.5" strokeWidth={2.1} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1.5 text-sm font-bold leading-snug text-neutral-900 dark:text-neutral-100">
            <span className="truncate">{meta.label}</span>
            {unread ? (
              <span className="size-2 shrink-0 rounded-full bg-[#2563EB]" aria-label="Unread" />
            ) : null}
          </p>
          <time
            className="hidden shrink-0 text-xs text-neutral-400 sm:block dark:text-neutral-500"
            dateTime={new Date(item.createdAt).toISOString()}
          >
            {timeLabel}
          </time>
        </div>
        <p className="mt-0.5 text-sm leading-snug text-neutral-600 dark:text-neutral-400">{item.message}</p>
        <time
          className="mt-1 block text-xs text-neutral-400 sm:hidden dark:text-neutral-500"
          dateTime={new Date(item.createdAt).toISOString()}
        >
          {timeLabel}
        </time>
      </div>
    </Link>
  )
}
