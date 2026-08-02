import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Not Found | Gorib Manush",
  description: "The page you're looking for doesn't exist.",
}

const btnBase = `
  inline-flex shrink-0 items-center justify-center gap-2
  h-11 px-8 text-sm
  font-extrabold uppercase tracking-wider whitespace-nowrap
  rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px]
  border border-transparent
  bg-[#FFC700] text-black
  hover:bg-[#171717] hover:text-white hover:border-[#171717]
  transition-colors duration-200 ease-in-out
  outline-none select-none cursor-pointer
  w-full sm:w-auto max-w-[240px]
` as const

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F3] overflow-hidden flex items-center justify-center px-6">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,208,0,0.15) 0%, rgba(255,208,0,0.05) 50%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full mx-auto py-16 sm:py-24">
        <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-md mb-8 sm:mb-10 select-none">
          <Image
            src="/not-found.svg"
            alt="Page not found"
            width={480}
            height={360}
            priority
            className="w-full h-auto"
          />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-black tracking-tight text-neutral-900 leading-[1.1] text-balance mb-3">
          This Page Doesn&apos;t Exist, Gorib.
        </h1>

        <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-sm mb-8 sm:mb-10">
          Let&apos;s get you back where your money is.
        </p>

        <Link href="/" className={btnBase}>
          <HomeIcon />
          Go Home
        </Link>
      </div>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
