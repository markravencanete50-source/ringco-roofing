'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import Aurora from './Aurora';
import { steps } from '@/lib/content';
import { clsx } from './clsx';

type Props = {
  eyebrow?: string;
  title?: string;
};

/**
 * "The claim, handled" 4-step process with a scroll-driven line-draw:
 * the connecting line fills as the user scrolls past steps 1→4, and each
 * step circle "activates" as the line reaches it. Shared by Home and
 * Insurance Claims so the motion reads as one system.
 */
export default function ClaimProcess({ eyebrow = 'The claim, handled', title = 'Most roofers install. We manage the whole claim.' }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when the steps enter the lower viewport, 1 once fully scrolled past.
        const raw = (vh * 0.82 - r.top) / (r.height + vh * 0.2);
        setP(Math.max(0, Math.min(1, raw)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const n = steps.length;

  return (
    <section className="relative overflow-hidden bg-panel px-[6vw] py-28">
      <Aurora
        orbs={[
          { color: 'var(--blue)', size: 620, top: '-24%', left: '6%', opacity: 0.16, motion: 'drift', duration: 26 },
          { color: 'var(--accent)', size: 520, bottom: '-28%', right: '2%', opacity: 0.1, motion: 'drift', duration: 32 },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-wrap">
        <Reveal>
          <p className="eyebrow text-blue">{eyebrow}</p>
          <h2 className="mt-3.5 max-w-[620px] font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">{title}</h2>
        </Reveal>

        <div ref={wrap} className="relative mt-14">
          {/* Horizontal track (desktop) — sits at circle-center height */}
          <div className="absolute left-0 right-0 top-[22px] hidden h-[2px] bg-[oklch(0.28_0.02_55)] lg:block">
            <div className="h-full bg-blue transition-[width] duration-200 ease-linear" style={{ width: `${p * 100}%` }} />
          </div>
          {/* Vertical track (mobile/tablet) */}
          <div className="absolute bottom-6 left-[21px] top-0 w-[2px] bg-[oklch(0.28_0.02_55)] lg:hidden">
            <div className="w-full bg-blue transition-[height] duration-200 ease-linear" style={{ height: `${p * 100}%` }} />
          </div>

          <div className="relative grid gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((s, i) => {
              const active = p >= (i + 0.5) / n;
              return (
                <div key={s.n} className="relative pl-16 lg:pl-0">
                  <div
                    className={clsx(
                      'absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] font-display text-[15px] font-bold transition-[background-color,border-color,color,box-shadow] duration-comp ease-out lg:relative lg:mb-5',
                      active
                        ? 'border-blue bg-blue text-[oklch(0.12_0.02_50)] shadow-[0_0_0_6px_oklch(0.68_0.15_230/0.15)]'
                        : 'border-[oklch(0.32_0.02_55)] bg-panel text-blue',
                    )}
                  >
                    {s.n}
                  </div>
                  <h3 className="mb-2.5 font-display text-[20px] font-bold text-[oklch(0.98_0.01_80)]">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[oklch(0.68_0.02_60)]">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
