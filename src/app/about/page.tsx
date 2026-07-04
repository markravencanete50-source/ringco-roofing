import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import MediaImg from '@/components/MediaImg';
import TeamGrid from '@/components/TeamGrid';
import AreaMap from '@/components/AreaMap';
import Certifications from '@/components/Certifications';
import CtaBand from '@/components/CtaBand';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About Ringco Roofing — Family-Owned in Oklahoma County, OK',
  description: 'Meet the family behind Ringco Roofing and Construction. Local, GAF-certified, and serving 15 cities across the Oklahoma City metro with a 15-year labor warranty.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      {/* Warm, personal hero — crew/truck/local area, not a roof close-up */}
      <PageHeader
        eyebrow="About us"
        title="Real local people. Really good roofs."
        sub="Ringco is a family business, not a storm-chasing franchise. When you call, you get a Ring — not a call center."
        image="/media/about-hero.jpg"
        imageLabel="crew / truck photo"
      />

      {/* Our story — dense trust copy, simple fade-up, no decoration competing */}
      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-wrap items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-accent-deep">Our story</p>
            <h2 className="mb-5 mt-3.5 font-display text-[clamp(28px,4vw,42px)] font-bold">Built on handshakes, backed by warranty paper.</h2>
            <div className="space-y-4 text-[16.5px] leading-relaxed text-muted">
              <p>
                Ringco started the way most good Oklahoma businesses do: one crew, one truck, and a promise to do the job like it was our own house. Storm after storm, that promise turned into 1,200+ roofs across the metro.
              </p>
              <p>
                We stayed family-owned on purpose. It means the person who quotes your roof is the person who answers when something needs attention — this year or fourteen years from now. It&rsquo;s also why we put a 15-year labor warranty in writing when most of the industry stops at two.
              </p>
              <p>
                And because Oklahoma weather doesn&rsquo;t respect business hours, neither do we: storm damage gets a response 24/7, and every inspection is free.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-40px_oklch(0.2_0.02_60/0.5)]">
              <MediaImg src="/media/about-story.jpg" alt="The Ringco crew on site" slotLabel="crew on-site photo" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team — photos are the main event */}
      <section className="bg-[oklch(0.94_0.012_78)] px-[6vw] py-24">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <p className="eyebrow text-accent-deep">The team</p>
            <h2 className="mb-12 mt-3.5 max-w-[560px] font-display text-[clamp(28px,4vw,42px)] font-bold">The people on your roof.</h2>
          </Reveal>
          <TeamGrid />
        </div>
      </section>

      {/* Service area — spatial trust beats a text list */}
      <section className="bg-panel px-[6vw] py-24">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <p className="eyebrow text-blue">Where we work</p>
            <h2 className="mb-4 mt-3.5 max-w-[560px] font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">If you can see downtown OKC from a ladder, we probably serve you.</h2>
            <p className="mb-12 max-w-[560px] text-[16px] text-[oklch(0.72_0.02_60)]">Based in {site.area}, on roofs across the whole metro.</p>
          </Reveal>
          <AreaMap />
        </div>
      </section>

      <Certifications />
      <CtaBand />
    </>
  );
}
