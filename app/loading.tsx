import Image from "next/image"

export default function Loading() {
  return (
    <div className="min-h-svh bg-[#FAF8F3] flex items-center justify-center">
      <BrandSpinner />
    </div>
  )
}

export function BrandSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-[#FFC700]/20" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#FFC700] animate-spin" />
        <div className="absolute inset-1.5 rounded-full bg-[#FFC700]/10 flex items-center justify-center">
          <Image
            src="/favicon.png"
            alt="Gorib Manush"
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading</p>
    </div>
  )
}
