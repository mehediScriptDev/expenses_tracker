"use client"

import { useStore } from "@/lib/store"
import { computeWarnings } from "@/lib/insights"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"
import { dashSectionTitle, dashCaption } from "@/dashboard/shared"
import { AlertRow } from "@/dashboard/dashboard/alert-row"

export function WarningsBanner() {
  const { data } = useStore()
  const warnings = computeWarnings(data).slice(0, 3)

  if (warnings.length === 0) {
    return (
      <div className="rounded-xl bg-[#E4F4E8] px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start gap-3">
          <Icon name="circle-check" className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">You&apos;re on track</p>
            <p className={cn(dashCaption, "mt-1")}>No warnings right now. Keep spending with intention.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className={dashSectionTitle}>Alerts</h3>
      {warnings.map((w) => (
        <AlertRow key={w.id} alert={w} />
      ))}
    </div>
  )
}
