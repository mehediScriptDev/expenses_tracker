import { Icon } from "@/lib/icon"

interface SectionHeadingProps {
  icon: string
  label: string
  title: string
  description: string
}

export function SectionHeading({ icon, label, title, description }: SectionHeadingProps) {
  return (
    <div className="text-center space-y-3">
      <p className="text-xs sm:text-sm font-medium text-neutral-500 tracking-wide">
        {label}
      </p>
      <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto text-pretty">
        {description}
      </p>
    </div>
  )
}
