import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import LeadForm from '@/components/LeadForm';
import ServiceAreas from '@/components/ServiceAreas';
import Tel, { TextLink } from '@/components/Tel';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact Ringco Roofing | Free Inspection — Oklahoma County',
  description:
    'Call, text, or request a free roof inspection from Ringco Roofing and Construction in Oklahoma County. Our own crew, 24/7 storm response.',
  alternates: { canonical: '/contact' },
};

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  '@id': `${site.url}/#business`,
  name: site.name,
  telephone: site.phone,
  email: site.email,
  areaServed: site.area,
  url: `${site.url}/contact`,
  address: { '@type': 'PostalAddress', addressRegion: 'OK', addressCountry: 'US' },
  openingHours: 'Mo-Sa 07:00-19:00',
  sameAs: [site.facebook],
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusiness} />
      <PageHeader
        eyebrow="Contact"
        title="Let’s get your free inspection on the calendar."
        sub="Call, text, or send the form — whatever’s easiest. Storm emergency? Call and we’ll respond 24/7."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* Multi-modal contact block */}
          <div>
            <div className="rounded-[20px] border border-line bg-card p-8 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
              <div className="eyebrow text-accent-deep">Talk to a person</div>
              <Tel className="mt-3 font-display text-[clamp(28px,4vw,40px)] font-bold text-ink" withDot />
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={`tel:${site.phone}`} className="rounded-full bg-accent px-6 py-3 font-display text-[14px] font-bold text-accent-ink transition-colors hover:bg-accent-hi">Call now</a>
                {site.textReady ? (
                  <TextLink className="rounded-full border-[1.5px] border-line px-6 py-3 font-display text-[14px] font-bold text-ink transition-colors hover:border-accent-deep" />
                ) : null}
                <a href={`mailto:${site.email}`} className="rounded-full border-[1.5px] border-line px-6 py-3 font-display text-[14px] font-bold text-ink transition-colors hover:border-accent-deep">Email</a>
              </div>

              <dl className="mt-8 space-y-4 border-t border-line pt-6 text-[15px]">
                <div>
                  <dt className="font-display text-[13px] font-bold uppercase tracking-wide text-muted">Hours</dt>
                  <dd className="mt-0.5 text-ink">{site.hours}</dd>
                </div>
                <div>
                  <dt className="font-display text-[13px] font-bold uppercase tracking-wide text-muted">Email</dt>
                  <dd className="mt-0.5 break-all text-ink">{site.email}</dd>
                </div>
                <div>
                  <dt className="font-display text-[13px] font-bold uppercase tracking-wide text-muted">Area served</dt>
                  <dd className="mt-0.5 text-ink">{site.area} and the surrounding metro</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <div className="eyebrow mb-4 text-accent-deep">Where we work</div>
              <ServiceAreas />
            </div>
          </div>

          {/* Lead form */}
          <div>
            <LeadForm />
          </div>
        </div>
      </Section>
    </>
  );
}
