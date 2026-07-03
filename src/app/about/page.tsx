import type { Metadata } from 'next';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Certifications from '@/components/Certifications';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'About Ringco Roofing | Family-Owned Roofers in Oklahoma County, OK',
  description: 'Ringco Roofing and Construction is a family-owned, GAF-certified roofing company serving Oklahoma County with honest inspections, real warranties, and no subcontractor games.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title="A family name on every roof we build." sub="We started Ringco because too many Oklahoma homeowners were getting rushed inspections, subcontracted crews, and warranties that vanished. We do it the opposite way." />
      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-wrap items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-40px_oklch(0.2_0.02_60/0.5)]">
              <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80" alt="The Ringco team on site" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-5 font-display text-[clamp(26px,3.4vw,38px)] font-bold">Own crews. Real warranties. Straight answers.</h2>
            <p className="mb-4 text-[17px] leading-relaxed text-muted">Every roof is installed by our own trained crews — never handed to the cheapest subcontractor of the week. That&rsquo;s how we can stand behind a 15-year labor warranty and mean it.</p>
            <p className="text-[17px] leading-relaxed text-muted">When a storm rolls through Oklahoma County, we&rsquo;ll tell you honestly whether you have a claim worth filing. If you don&rsquo;t, we&rsquo;ll say so. That honesty is why so much of our work comes from neighbors referring neighbors.</p>
          </Reveal>
        </div>
      </section>
      <section className="pb-4"><Certifications /></section>
      <CtaBand />
    </>
  );
}
