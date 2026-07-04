import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Reveal from '@/components/Reveal';
import CaseStudy from '@/components/CaseStudy';
import ReviewsGrid from '@/components/ReviewsGrid';
import Faq from '@/components/Faq';
import CrossLink from '@/components/CrossLink';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import { steps, okClaimFacts, faqs, site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Roof Insurance Claim Help in Oklahoma County | Ringco Roofing',
  description:
    'Storm damage? Ringco inspects before you file, meets your adjuster on the roof, and manages your Oklahoma roof insurance claim end-to-end. Free inspection, our own crew.',
  alternates: { canonical: '/insurance-claims' },
};

const points = [
  { t: 'We inspect before you file', b: 'Filing a weak claim helps no one. We tell you first, honestly, whether the storm damage is worth a claim.' },
  { t: 'We meet your adjuster on the roof', b: 'Adjusters miss things. We stand up there with them so legitimate storm damage gets documented and paid.' },
  { t: 'We handle the paperwork', b: 'Scope, measurements, photos, and supplements — we speak the insurer’s language so you don’t have to.' },
  { t: 'We follow the law, always', b: 'No inflated invoices and no deductible games that put you at legal risk. Assertive, documented, and compliant.' },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Roof storm damage insurance claim assistance',
  provider: { '@type': 'RoofingContractor', name: site.name, telephone: site.phone },
  areaServed: site.area,
  description: 'End-to-end roof insurance claim management for storm and hail damage in Oklahoma County.',
};

export default function InsuranceClaimsPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHeader
        eyebrow="Storm & insurance claims"
        title="Get the roof you’re owed — not the one you settle for."
        sub="Insurance companies are experts at paying less. We’re experts at documenting what the storm actually did. That’s the whole difference."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-line bg-card p-8 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
                <h3 className="mb-2.5 font-display text-[20px] font-bold">{p.t}</h3>
                <p className="text-[16px] leading-relaxed text-muted">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Animated process stepper */}
      <Section tone="panel">
        <SectionHead tone="dark" eyebrow="The claim, handled" title="How the claim works, step by step." />
        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[oklch(0.32_0.02_55)] font-display text-[15px] font-bold text-blue">{s.n}</div>
                <h3 className="mb-2.5 font-display text-[19px] font-bold text-[oklch(0.98_0.01_80)]">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-[oklch(0.68_0.02_60)]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Oklahoma-specific education (on-page, not a dead-end blog post) */}
      <Section>
        <SectionHead
          eyebrow="Oklahoma claims, specifically"
          title="What Oklahoma homeowners actually need to know."
          sub="Generic advice with a city name swapped in doesn’t help you. Here’s what’s specific to filing a roof claim in Oklahoma."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {okClaimFacts.map((f, i) => (
            <Reveal key={f.term} delay={i * 0.08}>
              <div className="h-full rounded-[18px] border border-line bg-card p-7 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
                <div className="mb-3 font-display text-[17px] font-bold text-accent-deep">{f.term}</div>
                <p className="text-[15px] leading-relaxed text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CaseStudy showCta={false} />

      {/* Real reviews — insurance-specific */}
      <Section>
        <SectionHead eyebrow="Claim wins" title="Neighbors we fought for." />
        <div className="mt-12"><ReviewsGrid filter="Insurance" /></div>
      </Section>

      <Section tone="panel">
        <SectionHead tone="dark" eyebrow="Claims FAQ" title="Straight answers to the real questions." />
        <div className="mt-10"><Faq items={faqs.insurance} /></div>
      </Section>

      <CrossLink
        eyebrow="Not storm-related?"
        title="Just need a roof repair or replacement?"
        body="If your project isn’t an insurance claim, head to our roofing page for repair-vs-replacement guidance and materials."
        href="/roofing"
        cta="Roofing"
      />

      <CtaBand title="Storm rolled through? Get a free inspection before you file." sub="No cost, no obligation. We’ll tell you straight whether you have a claim worth filing." />
    </>
  );
}
