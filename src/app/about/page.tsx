import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Reveal from '@/components/Reveal';
import Certifications from '@/components/Certifications';
import ServiceAreas from '@/components/ServiceAreas';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import { site, team, differentiators } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About Ringco Roofing — Family-Owned in Oklahoma County',
  description:
    'Roofing has been in the Ring family for decades. Learn why Ringco runs its own crew, why family ownership matters for your warranty, and who’s actually on your roof.',
  alternates: { canonical: '/about' },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: `${site.url}/about`,
  telephone: site.phone,
  email: site.email,
  founder: { '@type': 'Person', name: site.owner },
  sameAs: [site.facebook],
  description: 'Family-owned roofing, siding and gutter company serving Oklahoma County with an in-house crew.',
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={orgSchema} />
      <PageHeader
        eyebrow="About Ringco"
        title="Family-owned, local, and still here for your warranty."
        sub="The roofing companies that chase storms out of a rented truck don’t answer the phone in year three. We’re built to."
      />

      {/* Real history block — the genuine differentiator no competitor can copy */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow text-accent-deep">Our story</p>
            <h2 className="mb-5 mt-3.5 font-display text-[clamp(26px,3.4vw,40px)] font-bold">Roofing has been in the Ring family for decades.</h2>
            <p className="mb-4 text-[17px] leading-relaxed text-muted">
              {site.legacyNote} That isn’t a marketing line — it’s the reason we do the work the way we do. When your name is on the company and you live in the same metro as your customers, cutting corners isn’t an option.
            </p>
            <p className="text-[17px] leading-relaxed text-muted">
              Under {site.owner}, Ringco has grown into a full-exterior contractor — roofing, siding, and gutters — while staying small enough that the owner still knows your job by name.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[22px] border border-line bg-card p-8 shadow-[0_24px_50px_-34px_oklch(0.2_0.02_60/0.35)]">
              {differentiators.map((d, i) => (
                <div key={d.title} className={i > 0 ? 'mt-6 border-t border-line pt-6' : ''}>
                  <h3 className="mb-1.5 font-display text-[18px] font-bold">{d.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{d.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Team / faces */}
      <Section tone="panel">
        <SectionHead
          tone="dark"
          eyebrow="Who’s on your roof"
          title="Real people, named — not an anonymous “we.”"
          sub="These are the people our customers mention by name in their reviews. Photos coming soon."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="rounded-[18px] border border-[oklch(0.26_0.02_55)] bg-[oklch(0.19_0.02_50)] p-7 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-[20px] font-bold text-accent-ink">{m.initials}</div>
                <div className="font-display text-[18px] font-bold text-[oklch(0.98_0.01_80)]">{m.name}</div>
                <div className="text-[14px] text-[oklch(0.6_0.02_60)]">{m.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Certifications />

      <Section>
        <SectionHead eyebrow="Where we work" title="Proudly serving Oklahoma County." />
        <div className="mt-10"><ServiceAreas /></div>
      </Section>

      <CtaBand title="Work with a roofer who’ll still be here in year three." sub="Family-owned, our own crew, and a 15-year labor warranty. Book a free inspection." />
    </>
  );
}
