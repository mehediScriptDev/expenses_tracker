import Image from "next/image"
import { Icon } from "@/lib/icon"
import { SectionHeading } from "./section-heading"
import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2, type Testimonial } from "../_data/testimonials"

export function TestimonialsSection() {
  return (
    <section className="mt-28 w-full space-y-12 overflow-hidden py-4">
      <div className="text-center space-y-3 max-w-2xl mx-auto px-6">
        <SectionHeading
          icon="feather"
          label="Testimonial"
          title="Real Stories from Our App Users"
          description="Read how Gorib Manush has transformed the event and money management experiences of our users through convenience and ease of use."
        />
      </div>

      <div className="space-y-3 w-full">
        <TestimonialMarquee items={TESTIMONIALS_ROW_1} direction="right" avatarRing="ring-2 ring-neutral-200/70" fallbackBg="bg-amber-100" />
        <TestimonialMarquee items={TESTIMONIALS_ROW_2} direction="left" avatarRing="ring-2 ring-neutral-200/70" fallbackBg="bg-emerald-100" cardRadius="rounded-2xl" />
      </div>
    </section>
  )
}

function TestimonialMarquee({
  items,
  direction,
  avatarRing,
  fallbackBg,
  cardRadius = "rounded-xl",
}: {
  items: Testimonial[]
  direction: "left" | "right"
  avatarRing: string
  fallbackBg: string
  cardRadius?: string
}) {
  const animationClass = direction === "right" ? "animate-marquee-right" : "animate-marquee-left"
  const repeated = [...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden w-full py-2">
      <div className={`${animationClass} flex gap-4`}>
        {repeated.map((t, idx) => (
          <article
            key={idx}
            className={`w-[320px] shrink-0 ${cardRadius} border border-neutral-200/80 bg-white p-5 transition-all text-left space-y-3.5 flex flex-col justify-between`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed font-medium">&ldquo;{t.quote}&rdquo;</p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
              {t.avatar.startsWith("/") ? (
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className={`size-11 rounded-full object-cover shrink-0 ${avatarRing} shadow-2xs`}
                />
              ) : (
                <span className={`flex size-11 items-center justify-center rounded-full ${fallbackBg} text-xl ${avatarRing}`}>
                  {t.avatar}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-neutral-900 truncate tracking-tight">{t.name}</h4>
                <p className="text-xs text-neutral-500 truncate font-normal">{t.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
