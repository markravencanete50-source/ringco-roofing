import Button from './Button';
import { site } from '@/lib/content';

const chips = ['GAF Certified', '15-Year Labor Warranty', '24/7 Emergency', 'Insurance Claim Experts'];

/**
 * Home hero: looping drone pass over a finished Ringco roof (muted, 6–8s loop),
 * with a sharp drone still as poster for instant paint. Headline → subhead →
 * CTAs → badges stagger-fade-up, +100ms each.
 * Media slots: /media/home-hero.mp4 + /media/home-hero-poster.jpg (see MEDIA.md)
 */
export default function Hero() {
  return (
    <section className="relative h-screen max-h-[980px] min-h-[640px] overflow-hidden bg-[radial-gradient(120%_100%_at_20%_0%,oklch(0.22_0.03_50)_0%,oklch(0.15_0.02_50)_55%,oklch(0.11_0.018_50)_100%)]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay muted loop playsInline
        poster="/media/home-hero-poster.jpg"
      >
        <source src="/media/home-hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay — bottom 60% for text contrast */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.14_0.02_50/0.35)_0%,oklch(0.14_0.02_50/0.4)_40%,oklch(0.11_0.018_50/0.92)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.13_0.02_50/0.6)_0%,transparent_58%)]" />

      <div className="relative z-[2] flex h-full max-w-[900px] flex-col justify-center px-[6vw]">
        <p className="eyebrow mb-4 animate-fadeUp text-accent-hi">Roofing · Siding · Gutters · Storm Claims</p>
        <h1 className="mb-5 animate-fadeUp font-display text-[clamp(38px,6vw,68px)] font-bold leading-[1.05] text-[oklch(0.98_0.01_80)]" style={{ animationDelay: '100ms' }}>
          The roof Oklahoma weather can&rsquo;t beat.
        </h1>
        <p className="mb-8 max-w-[600px] animate-fadeUp text-[clamp(16px,1.7vw,20px)] text-[oklch(0.85_0.02_70)]" style={{ animationDelay: '200ms' }}>
          Family-owned, GAF-certified, and relentless on your insurance claim. We handle the storm damage, the adjuster, and the install — so you get the roof you&rsquo;re owed.
        </p>
        <div className="mb-9 flex flex-wrap gap-4 animate-fadeUp" style={{ animationDelay: '300ms' }}>
          <Button href="/contact" className="!px-8 !py-4 !text-[16px]">Get a free estimate</Button>
          <Button href={`tel:${site.phone}`} variant="outline" className="!px-8 !py-4 !text-[16px]">Call {site.phoneDisplay}</Button>
        </div>
        <div className="flex flex-wrap gap-2.5 animate-fadeUp" style={{ animationDelay: '400ms' }}>
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-[oklch(0.4_0.02_60/0.5)] bg-[oklch(0.2_0.02_50/0.4)] px-3.5 py-1.5 font-display text-[12px] font-semibold tracking-wide text-[oklch(0.88_0.02_70)]">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-7 left-[6vw] z-[2] flex animate-fadeUp items-center gap-2" style={{ animationDelay: '500ms' }}>
        <span className="h-[7px] w-[7px] animate-pulseRing rounded-full bg-accent-hi" />
        <span className="font-display text-[11px] tracking-[0.14em] text-[oklch(0.80_0.02_60)]">SERVING OKLAHOMA COUNTY, OK</span>
      </div>
    </section>
  );
}
