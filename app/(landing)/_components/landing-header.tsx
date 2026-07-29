import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  return (
    <header className="relative z-10 mx-auto container px-6 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={240}
          height={64}
          className="h-14 sm:h-16 w-auto object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="lg" asChild>
          <Link href="#">Who's for</Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="/dashboard">Dashboard →</Link>
        </Button>
      </div>
    </header>
  )
}
