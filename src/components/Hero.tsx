import MultiCta from './MultiCta';

const chips = ['GAF Certified', '15-Year Labor Warranty', 'BBB A+', 'Our Own Crew'];

export default function Hero() {
  return (
    <section className="relative h-screen max-h-[980px] min-h-[640px] overflow-hidden bg-[radial-gradient(120%_100%_at_20%_0%,oklch(0.22_0.03_50)_0%,oklch(0.15_0.02_50)_55%,oklch(0.11_0.018_50)_100%)]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay muted loop playsInline
        poster="https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1600&q=80"
      >
        <source src="https://cdn.coverr.co/videos/coverr-a-house-with-a-red-roof-2633/1080p.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-x-0 z-[1] h-[140px] animate-scanSweep bg-[linear-gradient(180deg,transparent_0%,oklch(0.75_0.15_230/0.16)_45%,oklch(0.75_0.15_230/0.28)_50%,oklch(0.75_0.15_230/0.16)_55%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.14_0.02_50/0.42)_0%,oklch(0.14_0.02_50/0.5)_45%,oklch(0.11_0.018_50/0.96)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.13_0.02_50/0.65)_0%,transparent_58%)]" />

      <div className="relative z-[2] flex h-full max-w-[900px] flex-col justify-center px-[6vw]">
        <p className="eyebrow mb-4 text-accent-hi">Family-owned · Serving Oklahoma County</p>
        <h1 className="mb-5 font-display text-[clamp(38px,6vw,68px)] font-bold leading-[1.05] text-[oklch(0.98_0.01_80)]">
          Our own crew on your roof &mdash; not a subcontractor you&rsquo;ve never met.
        </h1>
        <p className="mb-8 max-w-[600px] text-[clamp(16px,1.7vw,20px)] text-[oklch(0.85_0.02_70)]">
          Family-owned, GAF-certified, and relentless on your insurance claim. We handle the storm damage, the adjuster, and the install &mdash; and we&rsquo;re still here when your warranty needs us.
        </p>
        <div className="mb-9">
          <MultiCta />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-[oklch(0.4_0.02_60/0.5)] bg-[oklch(0.2_0.02_50/0.4)] px-3.5 py-1.5 font-display text-[12px] font-semibold tracking-wide text-[oklch(0.88_0.02_70)]">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-7 left-[6vw] z-[2] flex items-center gap-2">
        <span className="h-[7px] w-[7px] animate-pulseRing rounded-full bg-accent-hi" />
        <span className="font-display text-[11px] tracking-[0.14em] text-[oklch(0.80_0.02_60)]">SERVING OKLAHOMA COUNTY, OK</span>
      </div>
    </section>
  );
}
