'use client';
import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';

type Props = {
  before: string;
  after: string;
  caption?: string;
  priority?: boolean;
};

const DEFAULT_BEFORE = 'https://images.unsplash.com/photo-1595872018818-97555653a011?auto=format&fit=crop&w=1400&q=80';
const DEFAULT_AFTER = 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1400&q=80';

/**
 * Draggable before/after comparison slider. Robust clip-path approach — no
 * width measurement needed, so it stays aligned on resize. Reused on the home
 * page and across the gallery.
 */
export default function BeforeAfter({ before = DEFAULT_BEFORE, after = DEFAULT_AFTER, caption, priority }: Partial<Props>) {
  const [pos, setPos] = useState(55);
  const box = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(3, Math.min(97, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <figure className="m-0">
      <div
        ref={box}
        className="relative aspect-video w-full cursor-ew-resize select-none overflow-hidden rounded-[22px] bg-[oklch(0.7_0.02_90)] shadow-[0_30px_60px_-30px_oklch(0.2_0.02_60/0.35)]"
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onMouseDown={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        role="slider"
        aria-label="Before and after comparison"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* AFTER fills the frame */}
        <Image src={after} alt={caption ? `After: ${caption}` : 'Roof after replacement'} fill sizes="100vw" className="object-cover" priority={priority} />
        {/* BEFORE clipped to the left of the handle */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={caption ? `Before: ${caption}` : 'Roof before replacement'} fill sizes="100vw" className="object-cover" priority={priority} />
        </div>

        <span className="absolute left-5 top-5 rounded-full bg-[oklch(0.15_0.02_50/0.85)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-white">BEFORE</span>
        <span className="absolute right-5 top-5 rounded-full bg-[oklch(0.68_0.15_55/0.9)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-accent-ink">AFTER</span>

        <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-white shadow-[0_0_12px_oklch(0_0_0/0.35)]" style={{ left: `calc(${pos}% - 1.5px)` }} />
        <div className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-white shadow-[0_6px_16px_oklch(0_0_0/0.3)]" style={{ left: `${pos}%` }}>
          <span className="text-[oklch(0.4_0.02_60)]">‹</span><span className="text-[oklch(0.4_0.02_60)]">›</span>
        </div>
      </div>
      {caption ? <figcaption className="mt-3 text-[14px] text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
