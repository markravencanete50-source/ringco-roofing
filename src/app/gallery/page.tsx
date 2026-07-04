import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import GalleryGrid from '@/components/GalleryGrid';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Project Gallery — Before & After | Ringco Roofing — Oklahoma County, OK',
  description: 'Real Ringco roofing, siding and gutter projects across Oklahoma County. Drag the before/after sliders and watch drone footage of finished jobs.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Real roofs. Real addresses. Drag the slider."
        sub="Every project below is a real Ringco job — documented before, after, and (where we flew the drone) from the air."
        image="/media/gallery-hero.jpg"
        imageLabel="drone still — neighborhood"
      />

      <section className="px-[6vw] py-20">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <GalleryGrid />
          </Reveal>
        </div>
      </section>

      <section className="bg-panel px-[6vw] py-24">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <p className="eyebrow text-blue">What neighbors say</p>
            <h2 className="mb-12 mt-3.5 max-w-[560px] font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">Rated for the work, not the pitch.</h2>
          </Reveal>
          <ReviewsMarquee />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
