import * as React from "react"

export function WhatChangesSection() {
  return (
    <section className="mt-28 w-full container text-center">
      {/* Section Header */}
      <p className="text-xs sm:text-sm font-medium text-neutral-500 mb-2 tracking-wide">
        What changes
      </p>
      <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mb-4">
        How this shows up in your wallet
      </h2>
      <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mb-14 leading-relaxed text-pretty">
        You&apos;re solving today&apos;s money stress in a way that helps you feel more capable tomorrow.
      </p>

      {/* 3-Card Connected Container */}
      <div className="w-full rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 text-left shadow-2xs">
        
        {/* Card 01 - The Beginning */}
        <div className="relative bg-[#FAF6EE] p-8 sm:p-10 flex flex-col justify-between space-y-8">
          {/* Arrow notch on right edge (desktop) */}
          <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-0 h-0 border-y-12 border-y-transparent border-l-12 border-l-[#FAF6EE]" />

          <div className="space-y-4">
            <span className="block text-4xl sm:text-5xl font-extrabold text-neutral-300/80 font-sans tracking-tight">
              01
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug tracking-tight">
              The unexpected expenses don&apos;t make you spiral
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              You have a real-time spending pace — not a guesswork budget. When surprise costs hit, you know what to do next.
            </p>
          </div>

          <p className="text-xs font-semibold text-neutral-400 tracking-wide pt-4">
            The Beginning
          </p>
        </div>

        {/* Card 02 - The Shift */}
        <div className="relative bg-[#F3EAD5] p-8 sm:p-10 flex flex-col justify-between space-y-8">
          {/* Arrow notch on right edge (desktop) */}
          <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-0 h-0 border-y-12 border-y-transparent border-l-12 border-l-[#F3EAD5]" />

          <div className="space-y-4">
            <span className="block text-4xl sm:text-5xl font-extrabold text-neutral-400/50 font-sans tracking-tight">
              02
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug tracking-tight">
              You start building daily spending habits
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed font-normal">
              Daily limits, category tracking, loan alerts — not because you stopped enjoying life, but because you spend with intention.
            </p>
          </div>

          <p className="text-xs font-semibold text-neutral-500 tracking-wide pt-4">
            The Shift
          </p>
        </div>

        {/* Card 03 - The Arrival (Highlighted Yellow) */}
        <div className="relative bg-[#FFC700] p-8 sm:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <span className="block text-4xl sm:text-5xl font-extrabold text-black/20 font-sans tracking-tight">
              03
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-black leading-snug tracking-tight">
              You trust yourself with your money
            </h3>
            <p className="text-sm text-black/80 leading-relaxed font-medium">
              Not because budgeting got easy. Because you stopped worrying about payday.
            </p>
          </div>

          <p className="text-xs font-bold text-black/60 tracking-wide pt-4">
            The Arrival
          </p>
        </div>

      </div>
    </section>
  )
}
