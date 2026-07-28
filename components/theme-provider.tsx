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

function applyTheme(_t?: Theme) {
  if (typeof window !== "undefined") {
    const root = document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
  }
  return "light" as const
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light")
  const [resolved, setResolved] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    window.localStorage.setItem(THEME_KEY, "light")
    setThemeState("light")
    setResolved(applyTheme("light"))
  }, [])

  const setTheme = React.useCallback((t: Theme) => {
    window.localStorage.setItem(THEME_KEY, "light")
    setThemeState("light")
    setResolved(applyTheme("light"))
  }, [])

  const toggle = React.useCallback(() => {
    setTheme("light")
  }, [setTheme])

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
