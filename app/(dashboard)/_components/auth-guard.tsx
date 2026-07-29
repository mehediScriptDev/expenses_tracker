"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AppShell } from "./_components/layout/app-shell"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, hydrated } = useAuth()

  React.useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />
      </div>
    )
  }

  return <>{children}</>
}
