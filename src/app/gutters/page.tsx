import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Reveal from '@/components/Reveal';
import BeforeAfter from '@/components/BeforeAfter';
import Faq from '@/components/Faq';
import CrossLink from '@/components/CrossLink';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import { faqs, projects, site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Seamless Gutter Installation & Repair in Oklahoma County | Ringco Roofing',
  description:
    'Seamless gutters and leaf guards installed and repaired across Oklahoma County. Custom-formed on-site to protect your foundation from Oklahoma downpours. Free estimate.',
  alternates: { canonical: '/gutters' },
};

const offer = [
  { name: 'Seamless gutters', body: 'Formed on-site to fit your roofline with far fewer joints — which means far fewer leaks over the life of the system.' },
  { name: 'Leaf guards', body: 'Keep debris out and water moving, so your gutters keep protecting your foundation instead of clogging and overflowing.' },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Gutter installation and repair',
  provider: { '@type': 'RoofingContractor', name: site.name, telephone: site.phone },
  areaServed: site.area,
  description: 'Seamless gutter and leaf-guard installation and repair in Oklahoma County.',
};

export default function GuttersPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHeader
        eyebrow="Gutters"
        title="Seamless gutters that move water away from your foundation."
        sub="Overflowing or undersized gutters send water where it does the most damage. We form seamless systems on-site, sized for Oklahoma’s hardest rain."
      />

      <Section>
        <SectionHead eyebrow="What we offer" title="Built to keep water moving." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {offer.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="h-full rounded-[20px] border border-line bg-card p-8 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
                <h3 className="mb-2.5 font-display text-[20px] font-bold">{m.name}</h3>
                <p className="text-[16px] leading-relaxed text-muted">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <SectionHead
          tone="dark"
          eyebrow="Why it matters"
          title="Gutters are cheap insurance against foundation and water damage."
          sub="Water pooling at the base of your home is how expensive problems start. A properly sized, seamless system routes it away and out."
        />
      </Section>

      <Section>
        <SectionHead eyebrow="Recent work" title="Before & after." />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {projects.filter((p) => p.service === 'Gutters').map((p) => (
            <Reveal key={p.caption}><BeforeAfter before={p.before} after={p.after} caption={p.caption} /></Reveal>
          ))}
        </div>
      </Section>

      <CrossLink
        eyebrow="Storm damage?"
        title="Storm-damaged gutters can go on your insurance claim."
        body="If a hail or wind storm took out your gutters, it likely hit the roof too. We document all of it on one inspection."
        href="/insurance-claims"
        cta="Insurance claims"
      />

      <Section tone="panel">
        <SectionHead tone="dark" eyebrow="Gutters FAQ" title="Common questions" />
        <div className="mt-10"><Faq items={faqs.gutters} /></div>
      </Section>

      <CtaBand title="Protect your foundation before the next downpour." sub="Book a free estimate and we’ll size a seamless system to your roof." />
    </>
  );
}
