import * as React from "react"
import { Icon } from "@/lib/icon"

const FOUNDATION_CARDS = [
  {
    icon: "wallet",
    title: "Payday Pacing & Safe Limits",
    description: "We compute your real-time safe daily spending allowance so you never run out of money before your next salary.",
  },
  {
    icon: "target",
    title: "Category Budgets & Alerts",
    description: "We set intelligent monthly thresholds for Food, Shopping, Transport & Bills with automatic warning indicators.",
  },
  {
    icon: "hand-coins",
    title: "Borrowed & Lent Loans",
    description: "We track money you owe or lent to friends with clear settlement status, due dates, and overdue reminders.",
  },
  {
    icon: "shield-check",
    title: "100% Client-Side Privacy",
    description: "We store all your financial data securely in your local browser with zero cloud tracking and full JSON exports.",
  },
]

export function FeaturedSection() {
  return (
    <section className="mt-28 w-full container">
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        
        {/* Left Column: Bold Title */}
        <div className="lg:col-span-4 space-y-4 text-left pt-2">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
            Core Principles
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 leading-[1.12] tracking-tight">
            The Foundations of Gorib Manush
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
            Everything you need for effortless, private, and intelligent money management built right into your browser.
          </p>
        </div>

        {/* Right Column: 4 Two-Tone Green Banner Cards Grid */}
        <div className="lg:col-span-8 grid gap-6 sm:grid-cols-2 text-left">
          {FOUNDATION_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all border border-neutral-200/80 group"
            >
              {/* Green Header Banner */}
              <div className="bg-[#00A86B] p-5 sm:p-6 text-neutral-900">
                <h3 className="font-sans text-lg font-black tracking-tight leading-snug">
                  {card.title}
                </h3>
              </div>

              {/* White Card Body */}
              <div className="bg-white p-5 sm:p-6">
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
