"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export function DashboardScrollReset() {
  const pathname = usePathname()

  React.useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  React.useEffect(() => {
    const scrollTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    scrollTop()
    const id = requestAnimationFrame(scrollTop)
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}
