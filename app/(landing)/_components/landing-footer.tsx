import Link from "next/link"
import Image from "next/image"

export function LandingFooter() {
  return (
    <footer className="mt-32 w-full container border-t border-neutral-200/60 pt-12 pb-10 text-left space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Gorib Manush Logo"
              width={180}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
            Gorib Manush helps you take complete control of your finances with daily spending limits, budget tracking, and savings goals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 font-medium">
          <a href="#faq" className="hover:text-neutral-900 transition-colors">Privacy Policy</a>
          <a href="#faq" className="hover:text-neutral-900 transition-colors">Legal Terms</a>
          <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">Dashboard</Link>
        </div>
      </div>

      <div className="border-t border-neutral-200/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
        <p>© 2026 Gorib Manush. All rights reserved.</p>
        <p>
          Developed by{" "}
          <a
            href="https://mehediscriptdev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-neutral-800 hover:text-black underline underline-offset-2 transition-colors"
          >
            Mehedi
          </a>
        </p>
      </div>
    </footer>
  )
}
