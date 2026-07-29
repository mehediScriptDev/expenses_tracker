import { Icon } from "@/lib/icon"
import { SectionHeading } from "./section-heading"

const FEATURE_CARDS = [
  {
    icon: "shield-check",
    title: "Personalized Insights",
    description: "Get actionable tips based on your daily spending habits to save more and spend wisely.",
  },
  {
    icon: "file-text",
    title: "Investment Tracker",
    description: "Monitor your investments and grow your wealth effortlessly with automatic tracking.",
  },
  {
    icon: "scan",
    title: "Customizable Alerts",
    description: "Receive notifications for bill due dates, category spending limits, and loan repayments.",
  },
  {
    icon: "bell",
    title: "Expense Tracking",
    description: "Automatically categorize your spending for better financial clarity and total budget control.",
  },
] as const

export function FeaturedSection() {
  const [leftTop, leftBottom, rightTop, rightBottom] = FEATURE_CARDS

  return (
    <section className="mt-28 w-full container space-y-12">
      <SectionHeading
        icon="sparkles"
        label="Top Featured"
        title="Smart Features for Effortless Manage money"
        description="Enjoy seamless money management with our integrated tracking tools and continuous expert assistance."
      />

      <div className="grid gap-6 lg:grid-cols-3 items-center">
        <div className="space-y-6 text-left">
          <FeatureCard {...leftTop} />
          <FeatureCard {...leftBottom} />
        </div>

        <div className="relative mx-auto w-65 sm:w-72.5 rounded-[40px] border-[7px] border-neutral-900 bg-white p-3 shadow-2xl z-10">
          <div className="mx-auto h-3.5 w-24 rounded-full bg-neutral-900 mb-3" />

          <div className="space-y-4 text-left">
            <div className="rounded-2xl bg-[#7C3AED] p-4 text-white space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">Wallet</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">+</span>
              </div>

              <div className="relative mx-auto size-28 rounded-full border-4 border-amber-300 bg-white text-neutral-900 flex flex-col items-center justify-center">
                <span className="font-mono text-base font-black">৳ 120.00</span>
                <span className="text-[9px] font-bold text-neutral-400">Assets</span>
              </div>

              <div className="space-y-1 pt-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span>● Cash</span>
                  <span className="font-bold">৳ 90.00</span>
                </div>
                <div className="flex justify-between">
                  <span>● Investment</span>
                  <span className="font-bold">৳ 40.00</span>
                </div>
                <div className="flex justify-between">
                  <span>● Loan</span>
                  <span className="font-bold">৳ 10.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="rounded-xl bg-neutral-50 p-2.5 flex justify-between items-center shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">Februari Salary</p>
                  <p className="text-[9px] text-neutral-400">1 Day ago</p>
                </div>
                <span className="font-mono text-xs font-black text-[#00A86B]">৳ 20.00</span>
              </div>
              <div className="rounded-xl bg-neutral-50 p-2.5 flex justify-between items-center shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">Retirement Reserve</p>
                  <p className="text-[9px] text-neutral-400">1 Day ago</p>
                </div>
                <span className="font-mono text-xs font-black text-purple-700">৳ 20.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <FeatureCard {...rightTop} />
          <FeatureCard {...rightBottom} />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all space-y-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
        <Icon name={icon} className="size-5" />
      </span>
      <h3 className="font-serif text-lg font-bold text-neutral-900">{title}</h3>
      <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
    </div>
  )
}
