import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import LeadForm from '@/components/LeadForm';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Free Roofing Estimate | Contact Ringco Roofing — Oklahoma County, OK',
  description: 'Book a free, no-obligation roof inspection and estimate. Call (405) 470-7696 or send a request — Ringco Roofing serves all of Oklahoma County.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Free estimate" title="Tell us about your roof. We'll take it from here." sub="Two minutes now saves you a leaking ceiling later. No cost, no pressure — just a straight assessment from a local, family-owned crew." />
      <section className="px-[6vw] py-20">
        <div className="mx-auto grid max-w-wrap gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="mb-6 font-display text-[clamp(24px,3vw,34px)] font-bold">Prefer to talk?</h2>
            <a href={`tel:${site.phone}`} className="mb-8 inline-block font-display text-[clamp(28px,4vw,40px)] font-bold text-accent-deep">{site.phoneDisplay}</a>
            <div className="space-y-5 text-[16px]">
              <div><div className="eyebrow text-muted">Email</div><a href={`mailto:${site.email}`} className="font-semibold text-ink break-all hover:text-accent-deep">{site.email}</a></div>
              <div><div className="eyebrow text-muted">Service area</div><p className="font-semibold text-ink">{site.area}</p></div>
              <div><div className="eyebrow text-muted">Hours</div><p className="font-semibold text-ink">Mon–Sat · 24/7 emergency response</p></div>
            </div>
            <div className="mt-8 rounded-2xl border border-line bg-card p-5">
              <p className="font-display text-[15px] font-bold">Storm just hit?</p>
              <p className="mt-1 text-[14px] text-muted">Call the number above for same-day emergency tarping and inspection.</p>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
