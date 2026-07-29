import { METHOD_STEPS } from "../_data/sections"
import { LandingCta } from "./landing-cta"

export function MethodSection() {
  return (
    <section className="section-padding w-full container">
      <div className="rounded-3xl bg-[#FAF0E6] p-8 sm:p-12 md:p-16 text-neutral-900 shadow-2xs">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-600 underline underline-offset-4 decoration-neutral-400">
              The Gorib Manush Method
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 leading-[1.15] tracking-tight">
              A personal finance approach for every stage you&apos;re in
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              Gorib Manush is a privacy-first, zero-stress system — built to help you master daily spending,
              hit savings goals, and build lasting financial calm.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-7 pl-0 lg:pl-6 text-left">
            {METHOD_STEPS.map((step) => (
              <div key={step.badge} className="flex items-center gap-5 sm:gap-6 group">
                <div
                  className={`size-16 sm:size-18 shrink-0 font-mono font-black text-xs sm:text-sm tracking-wider flex items-center justify-center shadow-2xs transition-transform duration-200 group-hover:scale-105 ${step.badgeClass}`}
                >
                  {step.badge}
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-snug">{step.detail}</p>
                  <p className="text-sm sm:text-base font-black text-neutral-900 leading-snug">{step.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <LandingCta intent="finish-sign-up" size="lg" />
        </div>
      </div>
    </section>
  )
}
