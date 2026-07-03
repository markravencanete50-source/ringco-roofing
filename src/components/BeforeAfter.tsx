'use client';
import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';

const BEFORE = 'https://images.unsplash.com/photo-1595872018818-97555653a011?auto=format&fit=crop&w=1400&q=80';
const AFTER = 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1400&q=80';

export default function BeforeAfter() {
  const [pos, setPos] = useState(55);
  const box = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section className="px-[6vw] py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <p className="eyebrow text-[oklch(0.6_0.15_55)]">Real projects</p>
          <h2 className="mb-4 mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-bold">Drag to see the difference.</h2>
          <p className="mb-12 max-w-[560px] text-[17px] text-muted">Every roof we replace is documented before and after. Here&rsquo;s what a full storm-damage replacement looks like.</p>
        </Reveal>

        <Reveal>
          <div
            ref={box}
            className="relative aspect-video w-full cursor-ew-resize select-none overflow-hidden rounded-[22px] bg-[oklch(0.7_0.02_90)] shadow-[0_30px_60px_-30px_oklch(0.2_0.02_60/0.35)]"
            onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
            onMouseDown={(e) => move(e.clientX)}
            onTouchMove={(e) => move(e.touches[0].clientX)}
          >
            <Image src={BEFORE} alt="Roof before replacement" fill sizes="100vw" className="object-cover" priority />
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <div className="relative h-full" style={{ width: box.current?.clientWidth ?? 1200 }}>
                <Image src={AFTER} alt="Roof after replacement" fill sizes="100vw" className="object-cover" />
              </div>
            </div>
            <span className="absolute left-5 top-5 rounded-full bg-[oklch(0.15_0.02_50/0.85)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-white">BEFORE</span>
            <span className="absolute right-5 top-5 rounded-full bg-[oklch(0.68_0.15_55/0.9)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-accent-ink">AFTER</span>
            <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-white shadow-[0_0_12px_oklch(0_0_0/0.35)]" style={{ left: `calc(${pos}% - 1.5px)` }} />
            <div className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-white shadow-[0_6px_16px_oklch(0_0_0/0.3)]" style={{ left: `${pos}%` }}>
              <span className="text-[oklch(0.4_0.02_60)]">‹</span><span className="text-[oklch(0.4_0.02_60)]">›</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
