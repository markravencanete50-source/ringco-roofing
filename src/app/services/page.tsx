import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import CtaBand from '@/components/CtaBand';
import { services } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Roofing, Siding & Gutter Services | Ringco Roofing — Oklahoma County, OK',
  description: 'GAF-certified roof replacement and repair, siding, seamless gutters, and full storm-damage insurance claim management across Oklahoma County.',
  alternates: { canonical: '/services' },
};

const faqs = [
  { q: 'Do you offer free inspections?', a: 'Yes. Every roof inspection is free and no-obligation. We document what we find and tell you honestly whether a repair, replacement, or insurance claim makes sense.' },
  { q: 'Are you really GAF certified?', a: 'We are a factory-certified GAF installer, which lets us offer manufacturer-backed warranties alongside our own 15-year labor warranty.' },
  { q: 'How long does a roof replacement take?', a: 'Most residential replacements are completed in a single day. Larger or complex roofs may take two.' },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="Our services" title="One accountable crew for the whole exterior." sub="Roofing, siding, gutters and storm-claim management — no subcontractor handoffs, no finger-pointing, and a 15-year labor warranty on every roof." />
      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-wrap gap-16">
          {services.map((s, i) => (
            <Reveal key={s.slug}>
              <div className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-40px_oklch(0.2_0.02_60/0.5)]">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div>
                  <p className="eyebrow text-accent-deep">{s.tag}</p>
                  <h2 className="mb-4 mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-bold">{s.title}</h2>
                  <p className="mb-6 text-[17px] leading-relaxed text-muted">{s.blurb}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display font-bold text-accent-ink hover:bg-accent-hi">Get a free estimate →</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-panel px-[6vw] py-24">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-10 font-display text-[clamp(26px,3.6vw,40px)] font-bold text-[oklch(0.98_0.01_80)]">Common questions</h2>
          <div className="divide-y divide-[oklch(0.26_0.02_55)]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[18px] font-bold text-[oklch(0.95_0.01_80)]">
                  {f.q}<span className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[16px] leading-relaxed text-[oklch(0.72_0.02_60)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
