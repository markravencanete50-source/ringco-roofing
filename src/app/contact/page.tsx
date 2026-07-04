import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import LeadForm from '@/components/LeadForm';
import AreaMap from '@/components/AreaMap';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Free Estimate & Contact | Ringco Roofing — Oklahoma County, OK',
  description: 'Request a free roof inspection or estimate from Ringco Roofing. Call (405) 470-7696 or send the form — a real person responds, 24/7 for storm emergencies.',
  alternates: { canonical: '/contact' },
};

/**
 * Least decoration, most clarity. No hero media, no heavy motion —
 * a converting user is task-focused.
 */
export default function ContactPage({ searchParams }: { searchParams?: { service?: string } }) {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you're seeing. We'll take it from there."
        sub="Free inspection, free estimate, straight answers. Storm emergency? Skip the form and call — we answer 24/7."
      />

      <section className="px-[6vw] py-20">
        <div className="mx-auto grid max-w-wrap items-start gap-10 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <LeadForm defaultService={searchParams?.service} />
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-line bg-card p-7">
                <p className="eyebrow mb-4 text-accent-deep">Faster by phone</p>
                <a href={`tel:${site.phone}`} className="font-display text-[clamp(26px,3vw,34px)] font-bold text-ink transition-colors duration-micro hover:text-accent-deep">
                  {site.phoneDisplay}
                </a>
                <p className="mt-2 text-[14.5px] text-muted">24/7 for storm emergencies. Otherwise 7am–7pm, Mon–Sat.</p>
                <a href={`mailto:${site.email}`} className="mt-4 inline-block break-all text-[14.5px] font-semibold text-accent-deep">{site.email}</a>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div>
                <AreaMap compact />
                <p className="mt-3 text-center text-[13px] text-muted">Don&rsquo;t see your city? Call anyway — we&rsquo;re on roofs across the whole metro.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
