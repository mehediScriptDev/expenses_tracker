"use client"

import type React from "react"
import { AppShell } from "./_components/layout/app-shell"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell>{children}</AppShell>
}
