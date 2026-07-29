import { Button } from "@/components/ui/button"
import { LandingCta } from "./landing-cta"
import { HeroPhoneMockups } from "./hero-phone-mockups"

export function HeroSection() {
  return (
    <section className="text-center flex flex-col items-center">
      <p className="text-xs sm:text-sm font-medium text-neutral-500 mb-6 tracking-wide">
        #1 Personal Finance & Expense App
      </p>

      <h1 className="font-serif text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-[1.15] max-w-3xl text-balance">
        Take Control of Your Finances All in One App
      </h1>

      <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl text-pretty leading-relaxed">
        Say goodbye to financial stress with Gorib Manush, your all-in-one money management solution.
        Whether you&apos;re budgeting, tracking expenses, or saving for the future, we make it simple and stress-free.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline" size="lg" asChild>
          <a href="#who-its-for">Learn More</a>
        </Button>
        <LandingCta intent="start-tracking" size="lg" className="whitespace-nowrap" />
      </div>

      <HeroPhoneMockups />
    </section>
  )
}
