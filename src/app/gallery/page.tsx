import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Gallery from '@/components/Gallery';
import ReviewsGrid from '@/components/ReviewsGrid';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Project Gallery & Reviews | Ringco Roofing — Oklahoma County',
  description:
    'Real before-and-after roofing, siding, and gutter projects across Oklahoma County, plus verified customer reviews. See the work before you call.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery & reviews"
        title="See the work before you ever call."
        sub="Real projects, documented before and after — filter by the service you’re researching."
      />

      <Section>
        <Gallery />
      </Section>

      <Section tone="panel">
        <SectionHead tone="dark" eyebrow="What neighbors say" title="Rated for the work, not the pitch." />
        <div className="mt-12"><ReviewsGrid /></div>
      </Section>

      <CtaBand title="Want your roof to be the next before-and-after?" sub="Book a free inspection and we’ll show you exactly what we’d do." />
    </>
  );
}
