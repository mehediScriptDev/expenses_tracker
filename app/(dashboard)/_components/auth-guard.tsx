"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { BrandSpinner } from "@/app/loading"

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
      <div className="min-h-svh bg-[#FAF8F3] dark:bg-background flex items-center justify-center">
        <BrandSpinner />
      </div>
    )
  }

  return <>{children}</>
}
