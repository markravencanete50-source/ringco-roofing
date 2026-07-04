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
  title: 'Roof Replacement & Repair in Oklahoma County | Ringco Roofing',
  description:
    'GAF-certified roof repair and replacement across Oklahoma County. Straight answers on repair vs. replacement, premium materials, and a 15-year labor warranty. Free inspection.',
  alternates: { canonical: '/roofing' },
};

const repair = [
  'A handful of missing or cracked shingles after a storm',
  'One isolated leak with no widespread decking damage',
  'Flashing or boot failures around a vent or chimney',
  'A roof under ~15 years old in otherwise good shape',
];
const replace = [
  'Widespread granule loss, curling, or bald spots',
  'Storm damage across multiple slopes of the roof',
  'A roof past 15–20 years or on its second layer',
  'Repeated leaks, or decking that is soft underfoot',
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Roof repair and replacement',
  provider: { '@type': 'RoofingContractor', name: site.name, telephone: site.phone },
  areaServed: site.area,
  description: 'Roof repair and full replacement by an in-house, GAF-certified crew in Oklahoma County.',
};

export default function RoofingPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHeader
        eyebrow="Roofing"
        title="Roof repair & replacement, done by our own crew."
        sub="Whether it is a targeted repair or a full tear-off, the same GAF-certified team handles it — and stands behind it for 15 years."
      />

      {/* Repair vs. replacement decision block */}
      <Section>
        <SectionHead
          eyebrow="Repair or replace?"
          title="Not sure which you need? Here’s the honest test."
          sub="We will never sell you a replacement you don’t need. This is roughly how we think about it on an inspection."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[20px] border border-line bg-card p-8 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
              <div className="mb-4 inline-block rounded-full bg-[oklch(0.94_0.03_80)] px-3.5 py-1.5 font-display text-[12px] font-bold text-accent-deep">LIKELY A REPAIR</div>
              <ul className="space-y-3">
                {repair.map((r) => (
                  <li key={r} className="flex gap-3 text-[16px] text-muted"><span className="mt-1 text-accent">✓</span>{r}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-[20px] border border-[oklch(0.68_0.15_55/0.4)] bg-card p-8 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
              <div className="mb-4 inline-block rounded-full bg-accent px-3.5 py-1.5 font-display text-[12px] font-bold text-accent-ink">LIKELY A REPLACEMENT</div>
              <ul className="space-y-3">
                {replace.map((r) => (
                  <li key={r} className="flex gap-3 text-[16px] text-muted"><span className="mt-1 text-accent">✓</span>{r}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Materials / process */}
      <Section tone="panel">
        <SectionHead
          tone="dark"
          eyebrow="Materials & warranty"
          title="GAF-certified materials, explained — not just stamped on a flyer."
          sub="Being a factory-certified GAF installer lets us offer manufacturer-backed warranties on top of our own 15-year labor warranty. Ask us about Class 4 impact-resistant shingles, which can lower your insurance premium in Oklahoma."
        />
      </Section>

      {/* Roofing gallery */}
      <Section>
        <SectionHead eyebrow="Recent roofs" title="Before & after." />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {projects.filter((p) => p.service === 'Roofing').map((p) => (
            <Reveal key={p.caption}>
              <BeforeAfter before={p.before} after={p.after} caption={p.caption} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CrossLink
        eyebrow="Storm damage?"
        title="If your roof damage is storm-related, don’t file first."
        body="Hail and wind damage is usually an insurance claim, not an out-of-pocket repair. See how we document it and manage the claim end-to-end."
        href="/insurance-claims"
        cta="Insurance claims"
      />

      <Section tone="panel">
        <SectionHead tone="dark" eyebrow="Roofing FAQ" title="Common questions" />
        <div className="mt-10"><Faq items={faqs.roofing} /></div>
      </Section>

      <CtaBand title="Get a straight answer on your roof — for free." sub="We’ll inspect, document, and tell you honestly whether it’s a repair, a replacement, or a claim." />
    </>
  );
}
