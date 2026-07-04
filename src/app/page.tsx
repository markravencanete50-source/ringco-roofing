import Hero from '@/components/Hero';
import PathRouter from '@/components/PathRouter';
import Marquee from '@/components/Marquee';
import DifferentiatorBand from '@/components/DifferentiatorBand';
import Services from '@/components/Services';
import CaseStudy from '@/components/CaseStudy';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Reveal from '@/components/Reveal';
import BeforeAfter from '@/components/BeforeAfter';
import Stats from '@/components/Stats';
import Certifications from '@/components/Certifications';
import Reviews from '@/components/Reviews';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/content';

// Homepage owns the broad-intent LocalBusiness schema (not repeated per page).
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  '@id': `${site.url}/#business`,
  name: site.name,
  telephone: site.phone,
  email: site.email,
  areaServed: site.area,
  url: site.url,
  address: { '@type': 'PostalAddress', addressRegion: 'OK', addressCountry: 'US' },
  sameAs: [site.facebook],
  priceRange: '$$',
  openingHours: 'Mo-Sa 07:00-19:00',
  description:
    'Family-owned roofing, siding, gutter and insurance-claim specialists serving Oklahoma County, OK. Our own crew, GAF certified, 15-year labor warranty.',
};

export default function Home() {
  return (
    <>
      <JsonLd data={localBusiness} />
      <Hero />
      <PathRouter />
      <Marquee />
      <DifferentiatorBand />
      <Services />
      <CaseStudy />

      <Section>
        <SectionHead
          eyebrow="Real projects"
          title="Drag to see the difference."
          sub="Every roof we replace is documented before and after. Here’s what a full storm-damage replacement looks like."
        />
        <Reveal className="mt-12">
          <BeforeAfter priority />
        </Reveal>
      </Section>

      <Stats />
      <Certifications />
      <Reviews />
      <CtaBand />
    </>
  );
}
