import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Reveal from '@/components/Reveal';
import CtaBand from '@/components/CtaBand';
import { services } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Roofing, Siding, Gutters & Insurance Claims | Ringco Roofing — Oklahoma County',
  description:
    'One accountable, in-house crew for the whole exterior: roof replacement and repair, siding, seamless gutters, and full storm-damage insurance claim management in Oklahoma County.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our services"
        title="One accountable crew for the whole exterior."
        sub="Roofing, siding, gutters, and storm-claim management — no subcontractor handoffs, no finger-pointing, and a 15-year labor warranty on every roof. Pick where you want to go."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.08}>
              <Link
                href={s.href}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-card shadow-[0_18px_40px_-30px_oklch(0.2_0.02_60/0.4)] transition-transform duration-500 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-[oklch(0.99_0.005_80/0.92)] px-3 py-1.5 font-display text-[11px] font-bold tracking-wide text-[oklch(0.2_0.02_55)]">{s.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="mb-2.5 font-display text-[23px] font-bold">{s.title}</h2>
                  <p className="mb-5 flex-1 text-[15.5px] leading-relaxed text-muted">{s.blurb}</p>
                  <span className="inline-flex items-center gap-1.5 font-display text-[14.5px] font-bold text-accent-deep">
                    Learn more <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Not sure where to start?" sub="Book a free inspection and we’ll tell you exactly what the exterior needs — roof, siding, gutters, or a claim." />
    </>
  );
}
