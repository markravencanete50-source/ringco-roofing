import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import ClaimProcess from '@/components/ClaimProcess';
import ClaimStory from '@/components/ClaimStory';
import Accordion from '@/components/Accordion';
import CtaBand from '@/components/CtaBand';
import { okFacts, insuranceFaqs } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Roof Insurance Claim Help in Oklahoma | Ringco Roofing',
  description: 'Storm damage? Ringco documents the damage, meets your insurance adjuster on-site, and manages your roof claim end-to-end across Oklahoma County. Free inspection.',
  alternates: { canonical: '/insurance-claims' },
};

const points = [
  { n: 'A', t: 'We inspect before you file', b: 'Filing a weak claim can raise your premium for nothing. We tell you first whether the damage is worth a claim.' },
  { n: 'B', t: 'We meet your adjuster on the roof', b: 'Adjusters miss things. We stand up there with them so legitimate storm damage gets documented and paid.' },
  { n: 'C', t: 'We handle the paperwork', b: 'Scope, measurements, photos and supplements — we speak the insurer\u2019s language so you don\u2019t have to.' },
  { n: 'D', t: 'We follow the law, always', b: 'No inflated invoices, no \u201Cwe\u2019ll cover your deductible\u201D games that put you at legal risk. Straight work, done right.' },
];

export default function InsuranceClaimsPage() {
  return (
    <>
      {/* Deliberately no video here — this page is about substance and expertise. */}
      <PageHeader
        eyebrow="Storm & insurance claims"
        title="Get the roof you’re owed — not the one you settle for."
        sub="Insurance companies are experts at paying less. We’re experts at documenting what the storm actually did. That’s the whole difference."
      />

      {/* Scanning section — fast to read, light motion only */}
      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-wrap gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-line bg-card p-7 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.62_0.155_40/0.12)] font-display text-[15px] font-bold text-accent-deep">{p.n}</div>
                <h3 className="mb-2.5 font-display text-[19px] font-bold">{p.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Same component as Home — users recognize it as "the process" */}
      <ClaimProcess eyebrow="How it works" title="The claim, step by step." />

      {/* Oklahoma-specific trust content — always visible, no hover-gating */}
      <section className="px-[6vw] py-24">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <p className="eyebrow text-accent-deep">Know your rights in Oklahoma</p>
            <h2 className="mb-12 mt-3.5 max-w-[640px] font-display text-[clamp(28px,4vw,42px)] font-bold">Three things Oklahoma homeowners should know before filing.</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {okFacts.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-card p-8">
                  <h3 className="mb-3 font-display text-[22px] font-bold">{f.title}</h3>
                  <p className="text-[15.5px] leading-relaxed text-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured claim story — the best proof point on the whole site */}
      <section className="bg-panel px-[6vw] py-24">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <p className="eyebrow text-blue">Proof, not promises</p>
            <h2 className="mb-12 mt-3.5 max-w-[560px] font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">A denial isn&rsquo;t the end of the claim.</h2>
          </Reveal>
          <Reveal>
            <ClaimStory />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-panel-2 px-[6vw] py-24">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-10 font-display text-[clamp(26px,3.6vw,40px)] font-bold text-[oklch(0.98_0.01_80)]">Claim questions, answered straight</h2>
          <Accordion items={insuranceFaqs} />
        </div>
      </section>

      {/* Cross-link — simple card, no extra motion */}
      <section className="px-[6vw] py-20">
        <div className="mx-auto max-w-wrap">
          <Link href="/services" className="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-card p-8 transition-shadow duration-comp ease-out hover:shadow-[0_24px_50px_-36px_oklch(0.2_0.02_60/0.5)] md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-[22px] font-bold">Claim approved? See what the new roof includes.</h3>
              <p className="mt-1.5 text-[15.5px] text-muted">GAF-certified materials, one-day installs, and a 15-year labor warranty.</p>
            </div>
            <span className="font-display text-[15px] font-bold text-accent-deep">Explore roofing <span className="inline-block transition-transform duration-micro ease-out group-hover:translate-x-1">→</span></span>
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
