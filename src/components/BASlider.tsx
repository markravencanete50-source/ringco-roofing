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

/**
 * Draggable before/after comparison slider. Reused on Home + Gallery (+ lightbox).
 *
 * Semantics: BEFORE is the base layer (fills the frame); AFTER is clipped to the
 * region RIGHT of the handle, so the left of the handle reads "before" and the
 * right reads "after" — matching the corner labels. Dragging right reveals more
 * of the AFTER image.
 *
 * Interaction is unified through Pointer Events with pointer capture, so a drag
 * keeps tracking even when the cursor leaves the frame, and works identically for
 * mouse, touch and pen. `touch-action: none` stops the page from scrolling while
 * you drag on mobile. Fully keyboard-operable (arrows / Home / End).
 */
export default function BASlider({ before, after, altBefore = 'Before', altAfter = 'After', className, aspect = 'aspect-video', priority, rounded = 'rounded-[22px]' }: Props) {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    setTouched(true);
    box.current?.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    moveTo(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    box.current?.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === 'ArrowLeft') next = pos - step;
    else if (e.key === 'ArrowRight') next = pos + step;
    else if (e.key === 'Home') next = 2;
    else if (e.key === 'End') next = 98;
    if (next !== null) {
      e.preventDefault();
      setTouched(true);
      setPos(Math.max(2, Math.min(98, next)));
    }
  };

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison — drag or use arrow keys"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)}% revealed`}
      className={clsx('group relative w-full cursor-ew-resize touch-none select-none overflow-hidden bg-[oklch(0.7_0.02_90)] outline-none focus-visible:ring-2 focus-visible:ring-accent-hi focus-visible:ring-offset-2', aspect, rounded, className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      {/* BEFORE = base layer */}
      <MediaImg src={before} alt={altBefore} slotLabel="before photo" priority={priority} />
      {/* AFTER = revealed to the right of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <MediaImg src={after} alt={altAfter} slotLabel="after photo" priority={priority} />
      </div>

      <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-[oklch(0.15_0.02_50/0.85)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-white">BEFORE</span>
      <span className="pointer-events-none absolute right-5 top-5 rounded-full bg-[var(--accent)] px-3.5 py-1.5 font-display text-[12px] font-bold tracking-wide text-accent-ink">AFTER</span>

      {/* Divider line */}
      <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-white shadow-[0_0_12px_oklch(0_0_0/0.35)]" style={{ left: `calc(${pos}% - 1.5px)` }} />
      {/* Handle — subtle idle nudge until first interaction */}
      <div
        className={clsx(
          'pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-white text-[oklch(0.4_0.02_60)] shadow-[0_6px_16px_oklch(0_0_0/0.3)] transition-transform duration-micro ease-out group-hover:scale-110',
          !touched && 'animate-baNudge',
        )}
        style={{ left: `${pos}%` }}
      >
        <span aria-hidden>‹</span>
        <span aria-hidden>›</span>
      </div>

      {/* One-time affordance hint */}
      {!touched && (
        <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[oklch(0.15_0.02_50/0.8)] px-3.5 py-1.5 font-display text-[11px] font-semibold tracking-wide text-white opacity-90 transition-opacity duration-comp group-hover:opacity-0">
          ⟵ Drag to compare ⟶
        </span>
      )}
    </div>
  );
}
