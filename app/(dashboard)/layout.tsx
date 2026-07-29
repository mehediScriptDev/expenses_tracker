"use client"

import type React from "react"
import { AppShell } from "./_components/layout/app-shell"
import { AuthGuard } from "./_components/auth-guard"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
