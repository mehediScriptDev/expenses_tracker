import Image from "next/image"
import type { FinancialStage } from "../_data/sections"
import { FINANCIAL_STAGES } from "../_data/sections"
import { LandingCta } from "./landing-cta"
import { SectionHeading } from "./section-heading"

function StageCard({ stage }: { stage: FinancialStage }) {
  return (
    <article className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-6 sm:p-7 space-y-6">
      <div className="space-y-4">
        <div className={`-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 ${stage.bannerClass} pt-6 pb-9 px-6 rounded-b-[50%] shadow-2xs`}>
          <h3 className="font-sans text-lg sm:text-xl font-extrabold text-neutral-900">{stage.title}</h3>
        </div>

        <div className="relative z-10 -mt-12 flex justify-center items-center h-36 sm:h-44">
          <Image
            src={stage.image}
            alt={stage.title}
            width={180}
            height={180}
            className="h-36 sm:h-44 w-auto object-contain"
          />
        </div>

        <p className="font-mono text-xs sm:text-sm text-neutral-600 leading-relaxed px-2">{stage.quote}</p>

        <div className="border-b border-dashed border-neutral-200 w-3/4 mx-auto" />

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {stage.tags.map((tag) => (
            <span
              key={tag}
              className={`${stage.pillClass} text-neutral-800 text-[11px] font-semibold px-3 py-1 rounded-full`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <LandingCta
        intent="start-here"
        className={`w-full ${stage.buttonClass} text-neutral-900 font-extrabold tracking-wide uppercase text-xs h-11 rounded-2xl border-none`}
      />
    </article>
  )
}

export function FinancialStagesSection() {
  return (
    <section id="who-its-for" className="section-padding w-full container space-y-12 text-center">
      <SectionHeading
        eyebrow="Designed for your real life"
        title="Who is Gorib Manush for?"
        description="Tailored features built for wherever you are in your money journey."
      />

      <div className="grid gap-8 md:grid-cols-3 items-stretch">
        {FINANCIAL_STAGES.map((stage) => (
          <StageCard key={stage.id} stage={stage} />
        ))}
      </div>

      <div className="space-y-5">
        <p className="text-sm font-semibold text-neutral-700">
          Student, job holder, or freelancer? It&apos;s all in one Gorib Manush app.
        </p>
        <LandingCta intent="finish-sign-up" size="lg" />
      </div>
    </section>
  )
}
