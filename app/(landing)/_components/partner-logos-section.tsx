import { PARTNER_LOGOS } from "../_data/content"

export function PartnerLogosSection() {
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS]

  return (
    <section className="mt-20 border-t border-neutral-200/60 pt-10 w-full max-w-4xl space-y-6 overflow-hidden text-center">
      <p className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 text-center">
        Trusted by the top companies in the world
      </p>
      <div className="relative overflow-hidden w-full py-2">
        <div className="animate-marquee-right flex gap-12 sm:gap-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all text-neutral-700 font-serif font-black text-lg sm:text-xl items-center">
          {logos.map((logo, idx) => (
            <span key={idx} className="shrink-0 hover:text-neutral-900 transition-colors">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
