"use client"

import { useStore } from "@/lib/store"
import { computeWarnings, type Insight } from "@/lib/insights"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

const toneConfig: Record<Insight["tone"], { strip: string; border: string; icon: string }> = {
  danger:   { strip: "bg-red-50 dark:bg-red-950/30",       border: "border-red-200 dark:border-red-800",       icon: "text-red-600"      },
  warning:  { strip: "bg-[#FFF8D6] dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800",  icon: "text-yellow-700"   },
  positive: { strip: "bg-green-50 dark:bg-green-950/30",   border: "border-green-200 dark:border-green-800",    icon: "text-green-700"    },
  neutral:  { strip: "bg-neutral-50 dark:bg-muted",         border: "border-neutral-200 dark:border-neutral-700",icon: "text-neutral-500"  },
}

export function WarningsBanner() {
  const { data } = useStore()
  const warnings = computeWarnings(data).slice(0, 3)

  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 px-5 py-4">
        <Icon name="circle-check" className="size-5 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-extrabold text-neutral-900 dark:text-foreground">You&apos;re on track 🎉</p>
          <p className="text-xs text-neutral-500 dark:text-muted-foreground">No warnings right now. Keep spending with intention.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {warnings.map((w) => {
        const cfg = toneConfig[w.tone]
        return (
          <div
            key={w.id}
            className={cn("flex items-start gap-3 rounded-lg border px-5 py-4", cfg.strip, cfg.border)}
          >
            <Icon name={w.icon} className={cn("mt-0.5 size-5 shrink-0", cfg.icon)} />
            <div>
              <p className="text-sm font-extrabold text-neutral-900 dark:text-foreground">{w.title}</p>
              {w.detail && (
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-muted-foreground text-pretty">{w.detail}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
