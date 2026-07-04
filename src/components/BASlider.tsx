'use client';
import { useCallback, useRef, useState } from 'react';
import MediaImg from './MediaImg';
import { clsx } from './clsx';

type Props = {
  before: string;
  after: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
  /** e.g. 'aspect-video' or 'aspect-[4/3]' */
  aspect?: string;
  priority?: boolean;
  rounded?: string;
};

/** Draggable before/after comparison slider. Reused on Home + Gallery (+ lightbox). */
export default function BASlider({ before, after, altBefore = 'Before', altAfter = 'After', className, aspect = 'aspect-video', priority, rounded = 'rounded-[22px]' }: Props) {
  const [pos, setPos] = useState(55);
  const box = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className={clsx('relative w-full cursor-ew-resize select-none overflow-hidden bg-[oklch(0.7_0.02_90)]', aspect, rounded, className)}
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onMouseDown={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      <MediaImg src={before} alt={altBefore} slotLabel="before photo" priority={priority} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <MediaImg src={after} alt={altAfter} slotLabel="after photo" priority={priority} />
      </div>
      <span className="absolute left-5 top-5 rounded-full bg-[oklch(0.15_0.02_50/0.85)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-white">BEFORE</span>
      <span className="absolute right-5 top-5 rounded-full bg-[var(--accent)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-accent-ink">AFTER</span>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-white shadow-[0_0_12px_oklch(0_0_0/0.35)]" style={{ left: `calc(${pos}% - 1.5px)` }} />
      <div className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-white shadow-[0_6px_16px_oklch(0_0_0/0.3)]" style={{ left: `${pos}%` }}>
        <span className="text-[oklch(0.4_0.02_60)]">‹</span><span className="text-[oklch(0.4_0.02_60)]">›</span>
      </div>
    </div>
  );
}
