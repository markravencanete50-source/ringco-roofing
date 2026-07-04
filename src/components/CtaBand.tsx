import Button from './Button';
import Parallax from './Parallax';
import MediaImg from './MediaImg';
import { site } from '@/lib/content';

/**
 * Final CTA band with a very subtle parallax on a background drone still.
 * Media slot: /media/cta-drone.jpg (see MEDIA.md)
 */
export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_80%_0%,oklch(0.24_0.04_45)_0%,oklch(0.14_0.02_50)_60%)] px-[6vw] py-28">
      <Parallax className="absolute -inset-y-16 inset-x-0" factor={0.1}>
        <div className="relative h-full w-full opacity-25">
          <MediaImg src="/media/cta-drone.jpg" alt="" slotLabel="" sizes="100vw" />
        </div>
      </Parallax>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.14_0.02_50/0.55)_0%,oklch(0.13_0.02_50/0.8)_100%)]" />

      <div className="relative mx-auto max-w-wrap text-center">
        <h2 className="mx-auto mb-4 max-w-[720px] font-display text-[clamp(30px,4.4vw,50px)] font-bold text-[oklch(0.98_0.01_80)]">Storm rolled through? Get a free inspection before you file.</h2>
        <p className="mx-auto mb-8 max-w-[560px] text-[17px] text-[oklch(0.78_0.02_70)]">No cost, no obligation. We&rsquo;ll tell you straight whether you have a claim worth filing.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contact" className="!px-8 !py-4 !text-[16px]">Book my free inspection</Button>
          <Button href={`tel:${site.phone}`} variant="outline" className="!px-8 !py-4 !text-[16px]">Call {site.phoneDisplay}</Button>
        </div>
      </div>
    </section>
  );
}
