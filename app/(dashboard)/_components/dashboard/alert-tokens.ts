import type { Insight } from "@/types"
import { cn } from "@/lib/utils"

export const alertToneBg: Record<Insight["tone"], string> = {
  danger: "bg-[#FCEAEA] dark:bg-rose-950/40",
  warning: "bg-[#F8EBDD] dark:bg-amber-950/30",
  positive: "bg-[#E4F4E8] dark:bg-emerald-950/30",
  neutral: "bg-[#EDE9E1] dark:bg-neutral-800/60",
}

export const alertToneIcon: Record<Insight["tone"], string> = {
  danger: "text-destructive",
  warning: "text-[#B86A3C] dark:text-amber-400",
  positive: "text-success",
  neutral: "text-[#5C5955] dark:text-muted-foreground",
}

export function alertRowClass(tone: Insight["tone"], unread?: boolean) {
  return cn(
    "flex items-start gap-3 rounded-xl px-4 py-4 sm:px-5 sm:py-5 transition-all",
    alertToneBg[tone],
    unread && "shadow-sm ring-2 ring-[#FFC700]/50",
  )
}
