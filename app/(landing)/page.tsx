"use client"

import * as React from "react"
import { LandingPage } from "@/landing/landing-page"
import { LandingCta } from "@/landing/landing-cta"

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
          <LandingCta intent="get-started" size="lg" />
        </div>
      )}
    </div>
  )
}
