'use client';
import { useRef } from 'react';
import Button from './Button';
import Magnetic from './Magnetic';
import Aurora from './Aurora';
import { site } from '@/lib/content';

const chips = ['GAF Certified', '15-Year Labor Warranty', '24/7 Emergency', 'Insurance Claim Experts'];

/**
 * Home hero: looping drone pass over a finished Ringco roof (muted, ~8s loop),
 * with a sharp drone still as poster for instant paint. Headline → subhead →
 * CTAs → badges stagger-fade-up, +100ms each.
 *
 * Motion layer: the video and ambient glow shift subtly with the cursor
 * (mouse-parallax) for depth, on top of the slow Ken Burns drift. The video
 * layer is inset beyond the frame so the parallax never reveals an edge.
 * Pointer effects are desktop-only and skipped under reduced motion.
 * Media slots: /media/home-hero.mp4 + /media/home-hero-poster.jpg (see MEDIA.md)
 */
export default function Hero() {
  const videoLayer = useRef<HTMLDivElement>(null);
  const glowLayer = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const fine = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onPointerMove = (e: React.PointerEvent) => {
    if (!fine()) return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (videoLayer.current) videoLayer.current.style.transform = `translate3d(${(nx * -18).toFixed(1)}px, ${(ny * -18).toFixed(1)}px, 0)`;
      if (glowLayer.current) glowLayer.current.style.transform = `translate3d(${(nx * 34).toFixed(1)}px, ${(ny * 34).toFixed(1)}px, 0)`;
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(raf.current);
    if (videoLayer.current) videoLayer.current.style.transform = '';
    if (glowLayer.current) glowLayer.current.style.transform = '';
  };

  return (
    <section
      className="relative h-screen max-h-[980px] min-h-[640px] overflow-hidden bg-[radial-gradient(120%_100%_at_20%_0%,oklch(0.22_0.03_50)_0%,oklch(0.15_0.02_50)_55%,oklch(0.11_0.018_50)_100%)]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={videoLayer} className="absolute -inset-[26px] transition-transform duration-comp ease-out [will-change:transform]">
        <video
          className="h-full w-full animate-kenburns object-cover [will-change:transform]"
          autoPlay muted loop playsInline
          poster="/media/home-hero-poster.jpg"
        >
          <source src="/media/home-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Ambient glow — parallaxes opposite the video for depth */}
      <div ref={glowLayer} className="absolute inset-0 transition-transform duration-comp ease-out [will-change:transform]">
        <Aurora
          orbs={[
            { color: 'var(--accent)', size: 620, top: '-12%', left: '4%', opacity: 0.16, motion: 'drift', duration: 30 },
            { color: 'var(--blue)', size: 520, bottom: '-18%', right: '6%', opacity: 0.12, motion: 'float', duration: 26 },
          ]}
        />
      </div>

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
          <Magnetic><Button href="/contact" className="!px-8 !py-4 !text-[16px]">Get a free estimate</Button></Magnetic>
          <Magnetic><Button href={`tel:${site.phone}`} variant="outline" className="!px-8 !py-4 !text-[16px]">Call {site.phoneDisplay}</Button></Magnetic>
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
