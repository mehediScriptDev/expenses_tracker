import { Icon } from "@/lib/icon"
import { SectionHeading } from "./section-heading"

export function FeaturesSection() {
  return (
    <section id="features" className="mt-28 w-full container space-y-12">
      <SectionHeading
        icon="shapes"
        label="Features"
        title="The all-in-one money platform"
        description="Experience the convenience of managing your money on the go with Gorib Manush. Whether it&apos;s tracking expenses, setting budgets, or planning goals, we&apos;ve got you covered."
      />

      <div className="grid gap-6 md:grid-cols-2 text-left">
        <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
          <div className="rounded-2xl bg-linear-to-br from-[#E2F7E7] to-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#00A86B] text-white font-bold">
                <Icon name="wallet" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-black text-neutral-900">Category Budgets & Limits</p>
                <p className="text-[11px] text-neutral-500">Encrypted & auto-tracked in browser storage</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-200/50 pt-3 text-[11px] font-mono text-neutral-600">
              <span>6 Active Budgets</span>
              <span className="font-bold text-[#00A86B]">Safe Pace</span>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-neutral-900">Flexible budgeting tools & limits</h3>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
              Create monthly budgets with custom categories and instant warnings to ensure you stay safely on track.
            </p>
          </div>
        </div>

        <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
          <div className="rounded-2xl bg-neutral-50 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-neutral-900">Cash Flow Trends</p>
              <span className="text-[10px] font-mono text-neutral-400">100%</span>
            </div>
            <div className="h-20 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60">
                <path d="M 0 40 Q 40 10 80 30 T 160 15 T 200 35" fill="none" stroke="#00A86B" strokeWidth="3" />
                <path d="M 0 20 Q 50 50 100 25 T 180 45 T 200 20" fill="none" stroke="#FFC700" strokeWidth="3" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-neutral-900">See exactly where your money is going</h3>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
              Our diagrams and category breakdowns make it effortless to see where every taka of your money flows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 text-left">
        <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
          <div className="rounded-2xl bg-neutral-50 p-4 shadow-2xs space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Investment</p>
              <p className="font-mono text-lg font-black text-neutral-900">৳ 150,000</p>
            </div>
            <div className="space-y-1 border-t border-neutral-200/50 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cash Reserve</p>
              <p className="font-mono text-sm font-black text-[#00A86B]">৳ 20,000</p>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Manage money in one place</h3>
            <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
              Know exactly what you have saved, invested, or borrowed in real-time.
            </p>
          </div>
        </div>

        <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
          <div className="rounded-2xl bg-neutral-50 p-4 shadow-2xs space-y-3">
            <div className="h-20 rounded-xl bg-linear-to-r from-amber-400 to-amber-200 p-3 text-neutral-900 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full w-max">Hiking & Goal</span>
              <p className="font-mono text-sm font-black">৳ 50,000</p>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#00A86B] w-[75%]" />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Track your financial progress</h3>
            <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
              Track all of your savings goals and create a clear plan to achieve them.
            </p>
          </div>
        </div>

        <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
          <div className="rounded-2xl bg-neutral-50 p-4 shadow-2xs flex items-end justify-between h-28">
            {[40, 65, 30, 90, 50, 75].map((h, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-3.5 rounded-t-md ${idx === 3 ? "bg-[#FFC700]" : "bg-neutral-200"}`}
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] font-mono text-neutral-400">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx]}
                </span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Custom dashboard & reports</h3>
            <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
              Insights and daily pacing reports customized to fit your financial habits.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
