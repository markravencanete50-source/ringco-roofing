import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Stats from '@/components/Stats';
import BeforeAfter from '@/components/BeforeAfter';
import Certifications from '@/components/Certifications';
import Reviews from '@/components/Reviews';
import CtaBand from '@/components/CtaBand';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Stats />
      <BeforeAfter />
      <Certifications />
      <Reviews />
      <CtaBand />
    </>
  );
}
