"use client"

import * as React from "react"
import Link from "next/link"
import { LandingPage } from "@/landing/landing-page"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative">
      <LandingPage />

      {scrolled && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in duration-300">
          <Button size="lg" asChild>
            <Link href="/dashboard">Dashboard →</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
