"use client"

import * as React from "react"
import Link from "next/link"
import type { VariantProps } from "class-variance-authority"
import { Icon } from "@/lib/icon"
import { useAuth } from "@/lib/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GuestIntent =
  | "signup"
  | "get-started"
  | "login"
  | "start-tracking"
  | "start-here"
  | "finish-sign-up"

const GUEST_CTA: Record<
  GuestIntent,
  { href: string; label: string; showArrow?: boolean }
> = {
  signup: { href: "/signup", label: "Sign up" },
  "get-started": { href: "/signup", label: "Get started", showArrow: true },
  login: { href: "/login", label: "Login" },
  "start-tracking": { href: "/signup", label: "Start Tracking", showArrow: true },
  "start-here": { href: "/signup", label: "Start Here", showArrow: true },
  "finish-sign-up": { href: "/signup", label: "Finish Sign Up", showArrow: true },
}

interface LandingCtaProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  intent: GuestIntent
  className?: string
  asChild?: boolean
}

export function LandingCta({
  intent,
  variant,
  size,
  className,
  asChild = true,
  ...props
}: LandingCtaProps) {
  const { isAuthenticated, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <Button variant={variant} size={size} className={cn(className, "pointer-events-none opacity-0")} disabled>
        Loading
      </Button>
    )
  }

  if (isAuthenticated) {
    return (
      <Button variant={variant} size={size} className={className} asChild={asChild} {...props}>
        <Link href="/dashboard" className="inline-flex items-center gap-2">
          <span>Dashboard</span>
          <Icon name="arrow-right" className="size-4 shrink-0" />
        </Link>
      </Button>
    )
  }

  const cta = GUEST_CTA[intent]

  return (
    <Button variant={variant} size={size} className={className} asChild={asChild} {...props}>
      <Link href={cta.href} className="inline-flex items-center gap-2">
        <span>{cta.label}</span>
        {cta.showArrow ? <Icon name="arrow-right" className="size-4 shrink-0" /> : null}
      </Link>
    </Button>
  )
}

export function LandingNavLink({ className }: { className?: string }) {
  const { isAuthenticated, hydrated } = useAuth()

  if (!hydrated) return null

  if (isAuthenticated) {
    return (
      <Link href="/dashboard" className={cn("hover:text-neutral-900 transition-colors", className)}>
        Dashboard
      </Link>
    )
  }

  return (
    <Link href="/login" className={cn("hover:text-neutral-900 transition-colors", className)}>
      Login
    </Link>
  )
}
