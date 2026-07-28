"use client"

import * as React from "react"
import { THEME_KEY } from "@/lib/constants"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  resolved: "light" | "dark"
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const system = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
  const resolved = theme === "system" ? system : theme
  root.classList.remove("light", "dark")
  root.classList.add(resolved)
  return resolved
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [resolved, setResolved] = React.useState<"light" | "dark">("dark")

  React.useEffect(() => {
    const stored = (window.localStorage.getItem(THEME_KEY) as Theme) || "system"
    setThemeState(stored)
    setResolved(applyTheme(stored))
  }, [])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if ((window.localStorage.getItem(THEME_KEY) as Theme) === "system") {
        setResolved(applyTheme("system"))
      }
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const setTheme = React.useCallback((t: Theme) => {
    window.localStorage.setItem(THEME_KEY, t)
    setThemeState(t)
    setResolved(applyTheme(t))
  }, [])

  const toggle = React.useCallback(() => {
    setTheme(resolved === "dark" ? "light" : "dark")
  }, [resolved, setTheme])

  const value = React.useMemo(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
