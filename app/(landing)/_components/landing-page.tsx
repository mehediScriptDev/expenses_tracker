import { LandingHeader } from "./landing-header"
import { HeroSection } from "./hero-section"
import { PartnerLogosSection } from "./partner-logos-section"
import { FeaturesSection } from "./features-section"
import { FeaturedSection } from "./featured-section"
import { TestimonialsSection } from "./testimonials-section"
import { FaqSection } from "./faq-section"
import { LandingFooter } from "./landing-footer"

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F3] text-neutral-900 overflow-hidden font-sans">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <LandingHeader />

      <main className="relative z-10 mx-auto container px-6 pt-12 pb-20 flex flex-col items-center">
        <HeroSection />
        <PartnerLogosSection />
        <FeaturesSection />
        <FeaturedSection />
        <TestimonialsSection />
        <FaqSection />
        <LandingFooter />
      </main>
    </div>
  )
}
