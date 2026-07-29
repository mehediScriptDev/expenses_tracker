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
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
        <Icon name={icon} className="size-3.5 text-[#00A86B]" />
        <span>{label}</span>
      </div>
      <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto text-pretty">
        {description}
      </p>
    </div>
  )
}
