"use client"

import * as React from "react"
import { SectionHeading } from "./section-heading"
import { FAQ_ITEMS } from "../_data/content"

export function FaqSection() {
  const [openId, setOpenId] = React.useState<number | null>(0)

  return (
    <section id="faq" className="mt-28 w-full max-w-4xl mx-auto px-6 space-y-10 text-left">
      <SectionHeading
        eyebrow="FAQ"
        title="Common Questions"
        description="These are some frequently asked questions we&apos;ve answered to help new users get started."
      />

      <div className="border-t border-neutral-200">
        {FAQ_ITEMS.map((faq) => {
          const isOpen = openId === faq.id

          return (
            <button
              key={faq.id}
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full border-b border-neutral-200 py-6 text-left cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">{faq.q}</h3>
                <span className="text-2xl font-light text-neutral-900 shrink-0">{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen ? (
                <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl">{faq.a}</p>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
