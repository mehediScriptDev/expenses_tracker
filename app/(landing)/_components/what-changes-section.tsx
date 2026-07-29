import type { ChangeStep } from "../_data/sections"
import { WHAT_CHANGES_STEPS } from "../_data/sections"
import { SectionHeading } from "./section-heading"

function ChangeStepCard({ step }: { step: ChangeStep }) {
  return (
    <article className={`relative ${step.cardClass} p-8 sm:p-10 flex flex-col justify-between space-y-8`}>
      {step.arrowClass ? (
        <div
          className={`hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-0 h-0 border-y-12 border-y-transparent border-l-12 ${step.arrowClass}`}
        />
      ) : null}

      <div className="space-y-4">
        <span className={`block text-4xl sm:text-5xl font-extrabold font-sans tracking-tight ${step.numberClass}`}>
          {step.number}
        </span>
        <h3 className={`text-xl sm:text-2xl font-black leading-snug tracking-tight ${step.titleClass}`}>{step.title}</h3>
        <p className={`text-sm leading-relaxed ${step.descriptionClass}`}>{step.description}</p>
      </div>

      <p className={`text-xs font-semibold tracking-wide pt-4 ${step.labelClass}`}>{step.label}</p>
    </article>
  )
}

export function WhatChangesSection() {
  return (
    <section className="section-padding w-full container">
      <SectionHeading
        eyebrow="What changes"
        title="How this shows up in your wallet"
        description="You&apos;re solving today&apos;s money stress in a way that helps you feel more capable tomorrow."
      />

      <div className="mt-14 w-full rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 text-left shadow-2xs">
        {WHAT_CHANGES_STEPS.map((step) => (
          <ChangeStepCard key={step.number} step={step} />
        ))}
      </div>
    </section>
  )
}
