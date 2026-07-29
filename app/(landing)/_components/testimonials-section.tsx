import Image from "next/image"
import { Icon } from "@/lib/icon"
import type { Testimonial } from "../_data/testimonials"
import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2 } from "../_data/testimonials"
import { SectionHeading } from "./section-heading"

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="w-[320px] sm:w-85 shrink-0 rounded-xl bg-white p-6 text-left space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-1 text-[#FFC700]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icon key={index} name="star" className="size-4 fill-[#FFC700] text-[#FFC700]" />
          ))}
        </div>
        <p className="text-sm text-neutral-800 leading-relaxed font-medium">&ldquo;{item.quote}&rdquo;</p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Image
          src={item.avatar}
          alt={item.name}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover shrink-0 ring-2 ring-neutral-200/60"
        />
        <div className="min-w-0">
          <h4 className="text-xs font-mono font-bold text-neutral-900 truncate uppercase tracking-wider">{item.name}</h4>
          <p className="text-[11px] text-neutral-500 truncate">{item.role}</p>
        </div>
      </div>
    </article>
  )
}

function TestimonialMarquee({
  items,
  direction,
}: {
  items: Testimonial[]
  direction: "left" | "right"
}) {
  const animation = direction === "right" ? "animate-marquee-right" : "animate-marquee-left"
  const loop = [...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden w-full py-2">
      <div className={`${animation} flex gap-4`}>
        {loop.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="section-padding w-full space-y-12 overflow-hidden">
      <div className="px-6">
        <SectionHeading
          eyebrow="Testimonial"
          title="Real Stories from Our App Users"
          description="Read how Gorib Manush has transformed money management for our users through convenience and ease of use."
        />
      </div>

      <div className="space-y-3 w-full">
        <TestimonialMarquee items={TESTIMONIALS_ROW_1} direction="right" />
        <TestimonialMarquee items={TESTIMONIALS_ROW_2} direction="left" />
      </div>
    </section>
  )
}
