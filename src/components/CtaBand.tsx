import Button from './Button';
import { site } from '@/lib/content';

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_80%_0%,oklch(0.24_0.04_55)_0%,oklch(0.14_0.02_50)_60%)] px-[6vw] py-28">
      <div className="mx-auto max-w-wrap text-center">
        <h2 className="mx-auto mb-4.5 max-w-[720px] font-display text-[clamp(30px,4.4vw,50px)] font-bold text-[oklch(0.98_0.01_80)]">Storm rolled through? Get a free inspection before you file.</h2>
        <p className="mx-auto mb-8 max-w-[560px] text-[17px] text-[oklch(0.78_0.02_70)]">No cost, no obligation. We&rsquo;ll tell you straight whether you have a claim worth filing.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contact" className="!px-8 !py-4 !text-[16px]">Book my free inspection</Button>
          <Button href={`tel:${site.phone}`} variant="outline" className="!px-8 !py-4 !text-[16px]">Call {site.phoneDisplay}</Button>
        </div>
      </div>
    </section>
  );
}
