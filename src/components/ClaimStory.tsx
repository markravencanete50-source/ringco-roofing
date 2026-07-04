'use client';
import { useEffect, useRef, useState } from 'react';
import { claimStory } from '@/lib/content';
import { clsx } from './clsx';

/**
 * Featured claim story — case-study card with a mini horizontal stepper
 * (Denied → Re-inspected → Corrected → Approved) that animates once
 * on scroll-into-view. The best proof point on the site.
 */
export default function ClaimStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setStage(claimStory.stages.length - 1);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        claimStory.stages.forEach((_, i) => {
          setTimeout(() => setStage(i), 400 + i * 550);
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = claimStory.stages.length;

  return (
    <div ref={ref} className="overflow-hidden rounded-3xl border border-[oklch(0.28_0.02_55)] bg-[oklch(0.18_0.02_50)] shadow-[0_40px_80px_-50px_oklch(0_0_0/0.6)]">
      <div className="flex items-center justify-between gap-4 border-b border-[oklch(0.26_0.02_55)] px-8 py-5">
        <span className="font-mono text-[11.5px] tracking-[0.18em] text-[oklch(0.6_0.02_60)]">CASE STUDY — {claimStory.location.toUpperCase()}</span>
        <span className="rounded-full bg-[oklch(0.62_0.10_160/0.18)] px-3.5 py-1 font-display text-[12px] font-bold text-[oklch(0.75_0.10_160)]">CLAIM OVERTURNED</span>
      </div>

      <div className="grid gap-10 p-8 lg:grid-cols-[1.3fr_1fr] lg:p-10">
        <div>
          <h3 className="mb-4 font-display text-[clamp(24px,3vw,34px)] font-bold leading-tight text-[oklch(0.98_0.01_80)]">{claimStory.headline}</h3>
          <p className="text-[16px] leading-relaxed text-[oklch(0.75_0.02_60)]">{claimStory.body}</p>
          <p className="mt-5 font-display text-[17px] font-bold text-accent-hi">{claimStory.result}</p>
        </div>

        {/* Mini stepper */}
        <div className="flex flex-col justify-center">
          <div className="relative">
            <div className="absolute inset-x-5 top-[13px] h-[2px] bg-[oklch(0.28_0.02_55)]">
              <div
                className="h-full bg-blue transition-[width] duration-section ease-out"
                style={{ width: `${(Math.max(stage, 0) / (n - 1)) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {claimStory.stages.map((label, i) => {
                const reached = stage >= i;
                const isLast = i === n - 1;
                return (
                  <div key={label} className="flex w-16 flex-col items-center gap-2">
                    <span
                      className={clsx(
                        'flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-[12px] font-bold transition-[background-color,border-color,color,transform] duration-comp ease-out',
                        reached
                          ? isLast
                            ? 'scale-110 border-[oklch(0.62_0.10_160)] bg-[oklch(0.62_0.10_160)] text-[oklch(0.12_0.02_50)]'
                            : 'border-blue bg-blue text-[oklch(0.12_0.02_50)]'
                          : 'border-[oklch(0.32_0.02_55)] bg-[oklch(0.18_0.02_50)] text-[oklch(0.5_0.02_60)]',
                      )}
                    >
                      {reached ? '✓' : i + 1}
                    </span>
                    <span className={clsx('text-center text-[11.5px] font-bold leading-tight transition-colors duration-comp', reached ? 'text-[oklch(0.9_0.01_70)]' : 'text-[oklch(0.5_0.02_60)]')}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
