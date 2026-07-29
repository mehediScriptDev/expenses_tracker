"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated, hydrated } = useAuth()
  const [name, setName] = React.useState("")
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
      await signup(name, email, password)
      toast.success("Account created!")
      router.push("/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign up failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
      <header className="px-6 py-5">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={180} height={48} className="h-11 w-auto object-contain" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="font-serif text-3xl font-black text-neutral-900">Sign up</h1>
            <p className="text-sm text-neutral-600">Create your account and start tracking today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-800">Full name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-800">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-800">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Creating account..." : "Get started"}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-neutral-900 underline underline-offset-2">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
