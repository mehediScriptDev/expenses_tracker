"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const btnYellow = `
  inline-flex shrink-0 items-center justify-center gap-2
  h-11 px-8 text-sm
  font-extrabold uppercase tracking-wider whitespace-nowrap
  rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px]
  border border-transparent
  bg-[#FFC700] text-black
  hover:bg-[#171717] hover:text-white hover:border-[#171717]
  transition-colors duration-200 ease-in-out
  outline-none select-none cursor-pointer
  w-full sm:w-auto
` as const

const btnOutline = `
  inline-flex shrink-0 items-center justify-center gap-2
  h-11 px-8 text-sm
  font-extrabold uppercase tracking-wider whitespace-nowrap
  rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px]
  border border-neutral-300 bg-white text-neutral-800
  hover:bg-[#171717] hover:text-white hover:border-[#171717]
  transition-colors duration-200 ease-in-out
  outline-none select-none cursor-pointer
  w-full sm:w-auto
` as const

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

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
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,80,60,0.07) 0%, rgba(255,80,60,0.02) 50%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full mx-auto py-12 sm:py-20">
        <div className="w-full max-w-65 sm:max-w-sm md:max-w-md mb-5 sm:mb-6 select-none">
          <Image
            src="/error.svg"
            alt="Unexpected error"
            width={480}
            height={360}
            priority
            className="w-full h-auto"
          />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-black tracking-tight text-neutral-900 leading-[1.1] text-balance mb-3">
          Oops Gorib!!
        </h1>

        <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-sm mb-6 sm:mb-7">
          We ran into an unexpected error.
          <br />
          Please refresh the page or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button onClick={reset} className={btnYellow}>
            <RetryIcon />
            Try Again
          </button>

          <Link href="/" className={btnOutline}>
            <HomeIcon />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function RetryIcon() {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
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
