"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import {
  getNotifications,
  loadReadIds,
  persistReadIds,
  type AppNotification,
} from "@/lib/notifications"

export type NotificationInbox = {
  items: AppNotification[]
  unreadCount: number
  isUnread: (id: string) => boolean
  markRead: (id: string) => void
  markAllRead: () => void
}

export function useNotificationInbox(): NotificationInbox {
  const { data, hydrated } = useStore()
  const [readIds, setReadIds] = React.useState<Set<string>>(() =>
    typeof window !== "undefined" ? loadReadIds() : new Set(),
  )

  React.useEffect(() => {
    const sync = () => setReadIds(loadReadIds())
    const onReset = () => setReadIds(new Set())
    window.addEventListener("storage", sync)
    window.addEventListener("finbuddy:notifications:reset", onReset)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener("finbuddy:notifications:reset", onReset)
    }
  }, [])

  const items = React.useMemo(
    () => (hydrated ? getNotifications(data) : []),
    [data, hydrated],
  )

  const unreadIds = React.useMemo(
    () => new Set(items.filter((item) => !readIds.has(item.id)).map((item) => item.id)),
    [items, readIds],
  )

  const markRead = React.useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      persistReadIds(next)
      return next
    })
  }, [])

  const markAllRead = React.useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev)
      let changed = false
      for (const item of items) {
        if (!next.has(item.id)) {
          next.add(item.id)
          changed = true
        }
      }
      if (!changed) return prev
      persistReadIds(next)
      return next
    })
  }, [items])

  return {
    items,
    unreadCount: unreadIds.size,
    isUnread: (id: string) => unreadIds.has(id),
    markRead,
    markAllRead,
  }
}
