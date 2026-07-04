import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import CtaBand from '@/components/CtaBand';
import { steps } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Roof Insurance Claim Help in Oklahoma | Ringco Roofing',
  description: 'Storm damage? Ringco documents the damage, meets your insurance adjuster on-site, and manages your roof claim end-to-end across Oklahoma County. Free inspection.',
  alternates: { canonical: '/insurance-claims' },
};

const points = [
  { t: 'We inspect before you file', b: 'Filing a weak claim can raise your premium for nothing. We tell you first whether the damage is worth a claim.' },
  { t: 'We meet your adjuster on the roof', b: 'Adjusters miss things. We stand up there with them so legitimate storm damage gets documented and paid.' },
  { t: 'We handle the paperwork', b: 'Scope, measurements, photos and supplements — we speak the insurer\u2019s language so you don\u2019t have to.' },
  { t: 'We follow the law, always', b: 'No inflated invoices, no \u201Cwe\u2019ll cover your deductible\u201D games that put you at legal risk. Straight work, done right.' },
];

export default function InsuranceClaimsPage() {
  return (
    <>
      <PageHeader eyebrow="Storm & insurance claims" title="Get the roof you’re owed — not the one you settle for." sub="Insurance companies are experts at paying less. We’re experts at documenting what the storm actually did. That’s the whole difference." />
      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-wrap gap-6 md:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-line bg-card p-8 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
                <h3 className="mb-2.5 font-display text-[20px] font-bold">{p.t}</h3>
                <p className="text-[16px] leading-relaxed text-muted">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-panel px-[6vw] py-24">
        <div className="mx-auto max-w-wrap">
          <h2 className="mb-14 max-w-[560px] font-display text-[clamp(26px,3.6vw,40px)] font-bold text-[oklch(0.98_0.01_80)]">How the claim works, step by step</h2>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>
      <CtaBand />
    </>
  );
}
