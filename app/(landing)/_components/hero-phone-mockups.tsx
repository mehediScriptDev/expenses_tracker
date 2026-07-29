import type { ReactNode } from "react"
import { Icon } from "@/lib/icon"

const QUICK_ACTIONS = [
  { label: "Add", icon: "plus" },
  { label: "Goal", icon: "target" },
  { label: "Budget", icon: "pie-chart" },
  { label: "History", icon: "receipt" },
] as const

function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="mx-auto h-3.5 w-20 rounded-full bg-neutral-900 mb-3" />
      <div className="rounded-2xl bg-neutral-50 p-3 text-left">{children}</div>
    </div>
  )
}

export function HeroPhoneMockups() {
  return (
    <div className="relative mt-16 w-full max-w-4xl flex justify-center items-end min-h-115 sm:min-h-130">
      <PhoneFrame className="absolute left-[2%] sm:left-[8%] bottom-0 w-55 sm:w-65 rounded-[36px] border-[6px] border-neutral-900 bg-white p-3 shadow-xl -rotate-6 hover:rotate-0 transition-transform duration-500 z-10 hidden sm:block">
        <div className="space-y-3">
          <div className="relative h-28 rounded-xl bg-linear-to-tr from-amber-400 to-amber-200 p-3 text-neutral-900 flex flex-col justify-between overflow-hidden">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full w-max">
              Trip to Cox&apos;s Bazar
            </span>
            <div>
              <p className="text-[10px] font-medium opacity-80">Saved Target</p>
              <p className="font-mono text-base font-black">৳ 45,000</p>
            </div>
          </div>
          <div className="rounded-xl bg-white p-3 space-y-2 shadow-2xs">
            <p className="text-xs font-bold text-neutral-800">Monthly Contribution</p>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-500">December 2026</span>
              <span className="font-bold text-[#00A86B]">85%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#00A86B] w-[85%]" />
            </div>
          </div>
        </div>
      </PhoneFrame>

      <div className="relative w-70 sm:w-[320px] rounded-[44px] border-8 border-neutral-900 bg-white p-4 shadow-2xl z-20 hover:scale-[1.02] transition-transform duration-300">
        <div className="mx-auto h-4 w-28 rounded-full bg-neutral-900 mb-4" />
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                JD
              </div>
              <div>
                <p className="text-[10px] font-semibold text-neutral-400">Good Morning</p>
                <p className="text-xs font-black text-neutral-900">John Doe</p>
              </div>
            </div>
            <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100">
              <Icon name="more-horizontal" className="size-4 text-neutral-600" />
            </span>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-5 text-white shadow-md space-y-3">
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Our Balance</p>
            <p className="font-mono text-3xl font-black text-[#FFC700]">৳ 1,320.00</p>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-800 text-center">
              {QUICK_ACTIONS.map((action) => (
                <div key={action.label} className="flex flex-col items-center gap-1">
                  <span className="flex size-8 items-center justify-center rounded-full bg-neutral-800 text-[#FFC700]">
                    <Icon name={action.icon} className="size-4" />
                  </span>
                  <span className="text-[9px] font-medium text-neutral-300">{action.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center rounded-xl bg-green-50/80 p-2.5">
              <span className="text-xs font-bold text-green-900">Income</span>
              <span className="font-mono text-xs font-black text-[#00A86B]">৳ 16,000</span>
            </div>
            <div className="flex justify-between items-center rounded-xl bg-amber-50/80 p-2.5">
              <span className="text-xs font-bold text-amber-900">Expenses</span>
              <span className="font-mono text-xs font-black text-amber-800">৳ 4,800</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-neutral-900">Most Recent</span>
              <span className="text-[10px] font-bold text-neutral-400">See All</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-2">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-lg bg-white flex items-center justify-center text-xs shadow-2xs">🍔</span>
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">Grocery Market</p>
                  <p className="text-[9px] text-neutral-400">Today, 2:40 PM</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-red-600">- ৳ 120</span>
            </div>
          </div>
        </div>
      </div>

      <PhoneFrame className="absolute right-[2%] sm:right-[8%] bottom-0 w-55 sm:w-65 rounded-[36px] border-[6px] border-neutral-900 bg-white p-3 shadow-xl rotate-6 hover:rotate-0 transition-transform duration-500 z-10 hidden sm:block">
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
            <span className="text-xs font-extrabold text-neutral-800">Linked Accounts</span>
            <span className="text-[10px] font-bold text-[#00A86B]">+ Connect</span>
          </div>
          <div className="space-y-2">
            <div className="rounded-xl bg-white p-2.5 space-y-1 shadow-2xs">
              <p className="text-[10px] font-bold text-neutral-500">bKash Mobile Wallet</p>
              <p className="font-mono text-sm font-black text-neutral-900">৳ 8,450.00</p>
            </div>
            <div className="rounded-xl bg-white p-2.5 space-y-1 shadow-2xs">
              <p className="text-[10px] font-bold text-neutral-500">City Bank Savings</p>
              <p className="font-mono text-sm font-black text-neutral-900">৳ 125,000.00</p>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}
