'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Aurora from './Aurora';
import { reviews } from '@/lib/content';
import { clsx } from './clsx';

const AUTO_MS = 5000;

export default function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const r = reviews[i];

  const go = useCallback((next: number) => {
    setI((prev) => (next + reviews.length) % reviews.length);
  }, []);

  // Auto-rotate; pauses on hover/focus and under reduced motion.
  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((prev) => (prev + 1) % reviews.length), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, i]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    touchX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-panel px-[6vw] py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Aurora
        orbs={[
          { color: 'var(--blue)', size: 560, top: '-26%', right: '10%', opacity: 0.14, motion: 'drift', duration: 30 },
          { color: 'var(--accent)', size: 460, bottom: '-30%', left: '2%', opacity: 0.1, motion: 'float', duration: 26 },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-wrap">
        <p className="eyebrow text-blue">What neighbors say</p>
        <h2 className="mt-3.5 font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">Rated for the work, not the pitch.</h2>

        <div
          className="mt-10 max-w-[820px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-roledescription="carousel"
          aria-label="Customer reviews"
        >
          <div className="mb-5 text-[20px] tracking-[0.1em] text-accent">★★★★★</div>
          <p key={i} className="min-h-[120px] animate-fadeUp font-display text-[clamp(20px,2.4vw,30px)] font-medium leading-snug text-[oklch(0.94_0.01_80)]">&ldquo;{r.quote}&rdquo;</p>
          <div className="mt-6 font-display font-bold text-[oklch(0.98_0.01_80)]">{r.name}</div>
          <div className="text-[14px] text-[oklch(0.6_0.02_60)]">{r.role}</div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex gap-2">
              <button
                aria-label="Previous review"
                onClick={() => go(i - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[oklch(0.35_0.02_55)] text-[oklch(0.9_0.01_80)] transition-colors duration-micro hover:border-accent-hi hover:text-accent-hi"
              >
                ‹
              </button>
              <button
                aria-label="Next review"
                onClick={() => go(i + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[oklch(0.35_0.02_55)] text-[oklch(0.9_0.01_80)] transition-colors duration-micro hover:border-accent-hi hover:text-accent-hi"
              >
                ›
              </button>
            </div>
            <div className="flex gap-2.5">
              {reviews.map((_, k) => (
                <button
                  key={k}
                  aria-label={`Review ${k + 1}`}
                  aria-current={k === i}
                  onClick={() => setI(k)}
                  className={clsx('h-2.5 rounded-full transition-[width,background-color] duration-comp ease-out', k === i ? 'w-6 bg-accent' : 'w-2.5 bg-[oklch(0.35_0.02_55)] hover:bg-[oklch(0.5_0.02_55)]')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
