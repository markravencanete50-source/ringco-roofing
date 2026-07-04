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
  title: 'Siding Installation & Repair in Oklahoma County | Ringco Roofing',
  description:
    'Vinyl and fiber-cement siding installation and repair across Oklahoma County. Weather-tight, color-matched, installed by our own crew. Free estimate.',
  alternates: { canonical: '/siding' },
};

const materials = [
  { name: 'Vinyl siding', body: 'Low-maintenance, cost-effective, and available in a wide range of colors and profiles. A strong default for most Oklahoma homes.' },
  { name: 'Fiber-cement siding', body: 'Heavier, more impact- and fire-resistant, with a premium look. A durable step up where budget allows.' },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Siding installation and repair',
  provider: { '@type': 'RoofingContractor', name: site.name, telephone: site.phone },
  areaServed: site.area,
  description: 'Vinyl and fiber-cement siding installation and repair in Oklahoma County by an in-house crew.',
};

export default function SidingPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHeader
        eyebrow="Siding"
        title="Siding that protects the whole home — and lifts the curb appeal."
        sub="The same crew that does your roof handles your siding: weather-tight, color-matched, and built to take an Oklahoma storm."
      />

      <Section>
        <SectionHead eyebrow="Materials" title="What we install." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {materials.map((m, i) => (
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
          title="Siding is your home’s first layer of weather protection."
          sub="Failed or storm-damaged siding lets water and wind into the wall system. Replacing it protects the structure, cuts drafts, and can add real resale value."
        />
      </Section>

      <Section>
        <SectionHead eyebrow="Recent work" title="Before & after." />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {projects.filter((p) => p.service === 'Siding').map((p) => (
            <Reveal key={p.caption}><BeforeAfter before={p.before} after={p.after} caption={p.caption} /></Reveal>
          ))}
        </div>
      </Section>

      <CrossLink
        eyebrow="Storm damage?"
        title="Storm-damaged siding often goes on the same claim as your roof."
        body="Hail and wind rarely stop at the roofline. We document siding and gutter damage on the same inspection and put it on one claim."
        href="/insurance-claims"
        cta="Insurance claims"
      />

      <Section tone="panel">
        <SectionHead tone="dark" eyebrow="Siding FAQ" title="Common questions" />
        <div className="mt-10"><Faq items={faqs.siding} /></div>
      </Section>

      <CtaBand title="Ready to refresh and protect your exterior?" sub="Book a free, no-obligation estimate — we’ll look at siding, gutters, and roof together." />
    </>
  );
}
