import * as React from "react"
import Link from "next/link"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"

export function MethodSection() {
  const steps = [
    {
      badge: "NOW",
      badgeBg: "bg-[#F7B897]",
      badgeText: "text-neutral-900",
      blobRadius: "rounded-[55%_45%_62%_38%/45%_58%_42%_55%]",
      detail: "The mid-month panic. The worries. The questions.",
      quote: '"Where did my money go?"',
    },
    {
      badge: "SOON",
      badgeBg: "bg-[#F9CFB5]",
      badgeText: "text-neutral-900",
      blobRadius: "rounded-[45%_55%_40%_60%/55%_45%_58%_42%]",
      detail: "Impulse spending. Category limits. Instant alerts.",
      quote: '"Am I spending within my safe daily limit?"',
    },
    {
      badge: "LATER",
      badgeBg: "bg-[#F7B897]",
      badgeText: "text-neutral-900",
      blobRadius: "rounded-[60%_40%_55%_45%/48%_52%_45%_55%]",
      detail: "Savings targets. Debt clearance. Goal tracking.",
      quote: '"Why did budgeting used to feel so overwhelming?"',
    },
    {
      badge: "ALWAYS",
      badgeBg: "bg-[#E67E51]",
      badgeText: "text-white",
      blobRadius: "rounded-[48%_52%_45%_55%/58%_42%_56%_44%]",
      detail: "100% browser privacy. Complete financial confidence.",
      quote: '"With Gorib Manush, I trust myself with my money."',
    },
  ]

  return (
    <section className="mt-28 w-full container">
      <div className="w-full rounded-3xl bg-[#FAF0E6] p-8 sm:p-12 md:p-16 text-neutral-900 shadow-2xs">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Title & Subtitle */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-600 underline underline-offset-4 decoration-neutral-400">
              The Gorib Manush Method
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 leading-[1.15] tracking-tight">
              A personal finance approach for every stage you&apos;re in
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              Gorib Manush is a privacy-first, zero-stress system — built to help you master daily spending, hit savings goals, and build lasting financial calm.
            </p>
          </div>

          {/* Right Column: 4 Organic Bubble Blob Stage Items */}
          <div className="lg:col-span-7 space-y-7 pl-0 lg:pl-6 text-left">
            {steps.map((item, idx) => (
              <div key={idx} className="flex items-center gap-5 sm:gap-6 group">
                {/* Organic Circular Bubble Blob Badge */}
                <div
                  className={`size-16 sm:size-18 shrink-0 ${item.blobRadius} ${item.badgeBg} ${item.badgeText} font-mono font-black text-xs sm:text-sm tracking-wider flex items-center justify-center shadow-2xs transition-transform duration-200 group-hover:scale-105`}
                >
                  {item.badge}
                </div>

                {/* Text Details */}
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-snug">
                    {item.detail}
                  </p>
                  <p className="text-sm sm:text-base font-black text-neutral-900 leading-snug">
                    {item.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 pt-4 text-center flex justify-center">
          <Button size="lg" asChild className="shadow-xs group">
            <Link href="/dashboard" className="inline-flex items-center gap-2">
              <span>Finish Sign Up</span>
              <Icon name="arrow-right" className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}
