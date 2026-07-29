interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3 max-w-2xl mx-auto text-center">
      <p className="text-xs sm:text-sm font-medium text-neutral-500 tracking-wide">{eyebrow}</p>
      <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">{title}</h2>
      <p className="text-sm sm:text-base text-neutral-600 text-pretty">{description}</p>
    </div>
  )
}
