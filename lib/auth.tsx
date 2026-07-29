"use client"

import * as React from "react"
import { AUTH_KEY } from "./constants"

export interface AuthUser {
  email: string
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  hydrated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return
  if (!user) {
    window.localStorage.removeItem(AUTH_KEY)
    return
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setUser(readStoredUser())
    setHydrated(true)
  }, [])

  const login = React.useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !password.trim()) {
      throw new Error("Email and password are required.")
    }

    const existing = readStoredUser()
    const nextUser: AuthUser = {
      email: trimmedEmail,
      name: existing?.email === trimmedEmail ? existing.name : trimmedEmail.split("@")[0],
    }

    persistUser(nextUser)
    setUser(nextUser)
  }, [])

  const signup = React.useCallback(async (name: string, email: string, password: string) => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedName || !trimmedEmail || !password.trim()) {
      throw new Error("Name, email, and password are required.")
    }

    const nextUser: AuthUser = { email: trimmedEmail, name: trimmedName }
    persistUser(nextUser)
    setUser(nextUser)
  }, [])

  const logout = React.useCallback(() => {
    persistUser(null)
    setUser(null)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hydrated,
      login,
      signup,
      logout,
    }),
    [user, hydrated, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
