import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"

export function FinancialStagesSection() {
  const stages = [
    {
      id: "stage-1",
      title: "Daily Expense Trackers",
      bannerBg: "bg-[#F5A882]",
      pillBg: "bg-[#FCE4D6]",
      buttonBg: "bg-[#F5A882] hover:bg-[#e0946f]",
      image: "/first.svg",
      quote: '"I want to stop overspending on daily food, transport, and quick bKash payments."',
      tags: ["Daily Pacing", "Impulse Control", "Cash & bKash", "Payday Limits", "Instant Log"],
    },
    {
      id: "stage-2",
      title: "Goal Seekers & Savers",
      bannerBg: "bg-[#96DAA9]",
      pillBg: "bg-[#E2F5E8]",
      buttonBg: "bg-[#96DAA9] hover:bg-[#82c895]",
      image: "/growing.svg",
      quote: '"I want to set monthly category budgets, track loans, and save for my future goals."',
      tags: ["Category Limits", "Savings Goals", "Borrowed & Lent", "Budget Alerts", "Monthly Insights"],
    },
    {
      id: "stage-3",
      title: "Smart Money Planners",
      bannerBg: "bg-[#89C4FD]",
      pillBg: "bg-[#E1EFFD]",
      buttonBg: "bg-[#89C4FD] hover:bg-[#72b3ee]",
      image: "/freedom.svg",
      quote: '"I want a complete financial health score, net worth control, and 100% data privacy."',
      tags: ["Health Score", "Debt Tracking", "CSV Backup", "Smart Analytics", "Total Privacy"],
    },
  ]

  return (
    <section className="mt-28 w-full container text-center space-y-12">
      {/* Section Header */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm font-medium text-neutral-500 tracking-wide">
          Designed for your real life
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Who is Gorib Manush for?
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 text-pretty">
          Tailored features built for wherever you are in your money journey.
        </p>
      </div>

      {/* 3 Color-Coded Stage Cards Grid */}
      <div className="grid gap-8 md:grid-cols-3 text-center items-stretch">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-6 sm:p-7 space-y-6"
          >
            {/* Top Banner Header */}
            <div className="space-y-4">
              <div className={`-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 ${stage.bannerBg} pt-6 pb-9 px-6 rounded-b-[50%] shadow-2xs`}>
                <h3 className="font-sans text-lg sm:text-xl font-extrabold text-neutral-900">
                  {stage.title}
                </h3>
              </div>

              {/* SVG Illustration - Overlapping curved banner */}
              <div className="relative z-10 -mt-12 flex justify-center items-center h-36 sm:h-44">
                <Image
                  src={stage.image}
                  alt={stage.title}
                  width={180}
                  height={180}
                  className="h-36 sm:h-44 w-auto object-contain"
                  priority
                />
              </div>

              {/* User Quote */}
              <p className="font-mono text-xs sm:text-sm text-neutral-600 leading-relaxed px-2">
                {stage.quote}
              </p>

              {/* Dotted Divider */}
              <div className="border-b border-dashed border-neutral-200 w-3/4 mx-auto" />

              {/* Tag Chips / Pills */}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {stage.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`${stage.pillBg} text-neutral-800 text-[11px] font-semibold px-3 py-1 rounded-full transition-colors`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4">
              <Button
                asChild
                className={`w-full ${stage.buttonBg} text-neutral-900 font-extrabold tracking-wide uppercase text-xs h-11 rounded-2xl shadow-2xs border-none group`}
              >
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2">
                  <span>Start Here</span>
                  <Icon name="arrow-right" className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="pt-4 space-y-5 text-center">
        <p className="text-sm font-semibold text-neutral-700">
          Student, job holder, or freelancer? It&apos;s all in one Gorib Manush app.
        </p>
        <div>
          <Button
            size="lg"
            asChild
            className="shadow-xs group"
          >
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
