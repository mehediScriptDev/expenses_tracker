import { cn } from "@/lib/utils"

export function headerActionClass(active?: boolean) {
  return cn(
    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer",
    "bg-[#EBF3FA] text-[#2B4C7E] hover:bg-[#DEEBF7]",
    "ring-1 ring-[#2B4C7E]/8 dark:bg-[#243248] dark:text-[#7eb3ff] dark:ring-white/10 dark:hover:bg-[#2a3a52]",
    active &&
      "bg-[#FFC700] text-neutral-900 ring-[#FFC700]/40 hover:bg-[#FFC700] dark:bg-[#FFC700] dark:text-neutral-900",
  )
}

export const headerBadgeClass =
  "absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FFC700] px-1 text-[10px] font-black leading-none text-neutral-900 ring-2 ring-[#FAF8F3] dark:ring-background"
