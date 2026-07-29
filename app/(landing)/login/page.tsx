"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  AuthDivider,
  AuthField,
  AuthPasswordField,
  AuthShell,
  AuthTerms,
  AuthTitle,
  GoogleAuthButton,
} from "@/landing/auth/auth-shell"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, hydrated } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [hydrated, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success("Welcome back!")
      router.push("/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = () => {
    toast.info("Google sign-in will be available soon.")
  }

  return (
    <AuthShell
      progress={50}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-neutral-900 underline underline-offset-2">
            Sign up
          </Link>
        </>
      }
    >
      <AuthTitle>Welcome back. Log in to your account.</AuthTitle>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <AuthPasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full mt-2" size="lg" disabled={submitting}>
          {submitting ? "Signing in..." : "Continue"}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <AuthDivider />
        <GoogleAuthButton onClick={handleGoogle} />
        <AuthTerms />
      </div>
    </AuthShell>
  )
}
