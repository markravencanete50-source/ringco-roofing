import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import MediaImg from '@/components/MediaImg';
import Button from '@/components/Button';
import { services, categoryColors, site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Roofing, Siding & Gutter Services | Ringco Roofing — Oklahoma County, OK',
  description: 'GAF-certified roof replacement and repair, siding, seamless gutters, and full storm-damage insurance claim management across Oklahoma County.',
  alternates: { canonical: '/services' },
};

/**
 * Hub page — its job is fast routing, not persuasion.
 * Four large cards with color-coded accent bars; hover reveals a
 * "what's included" list sliding up from the bottom of the card.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our services"
        title="One accountable crew for the whole exterior."
        sub="Roofing, siding, gutters and storm-claim management — no subcontractor handoffs, no finger-pointing, and a 15-year labor warranty on every roof."
        image="/media/services-hero.jpg"
        imageLabel="drone still — finished roof"
      />

      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-wrap gap-8 md:grid-cols-2">
          {services.map((s, i) => {
            const href = s.slug === 'insurance-claims' ? '/insurance-claims' : `/contact?service=${s.slug}`;
            return (
              <Reveal key={s.slug} delay={i * 0.08}>
                <Link href={href} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[0_24px_50px_-36px_oklch(0.2_0.02_60/0.5)] transition-[transform,box-shadow] duration-comp ease-out group-hover:-translate-y-1 group-hover:shadow-[0_34px_60px_-32px_oklch(0.2_0.02_60/0.6)]">
                    <span className="h-1.5 w-full" style={{ background: categoryColors[s.slug] }} />
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <MediaImg src={s.image} alt={s.title} slotLabel={`${s.tag.toLowerCase()} photo`} sizes="(max-width:768px) 100vw, 50vw" className="transition-transform duration-section ease-out group-hover:scale-105" />
                      {/* What's included — slides up from the bottom on hover (always visible on touch via focus/active fallback: list also repeats below) */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[oklch(0.14_0.02_50/0.92)] p-5 backdrop-blur-sm transition-transform duration-comp ease-out group-hover:translate-y-0">
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                          {s.included.map((item) => (
                            <li key={item} className="flex items-baseline gap-2 text-[13px] font-semibold text-[oklch(0.88_0.02_70)]">
                              <span className="text-accent-hi">✓</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <p className="eyebrow mb-2" style={{ color: categoryColors[s.slug] }}>{s.tag}</p>
                      <h2 className="mb-2.5 font-display text-[26px] font-bold">{s.title}</h2>
                      <p className="mb-5 flex-1 text-[15.5px] leading-relaxed text-muted">{s.blurb}</p>
                      <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-bold text-accent-deep">
                        {s.slug === 'insurance-claims' ? 'How claims work' : 'Get a free estimate'}
                        <span className="transition-transform duration-micro ease-out group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Low-friction fallback — deliberately unanimated so it doesn't compete with the cards */}
      <section className="bg-panel px-[6vw] py-20">
        <div className="mx-auto flex max-w-wrap flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold text-[oklch(0.98_0.01_80)]">Not sure where to start?</h2>
            <p className="mt-2 max-w-[520px] text-[16px] text-[oklch(0.72_0.02_60)]">Call us and describe what you&rsquo;re seeing. We&rsquo;ll tell you in two minutes whether it&rsquo;s a repair, a replacement, or a claim.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href={`tel:${site.phone}`}>Call {site.phoneDisplay}</Button>
            <Button href="/contact" variant="outline">Request an inspection</Button>
          </div>
        </div>
      </section>
    </>
  );
}
