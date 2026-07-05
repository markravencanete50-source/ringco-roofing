'use client';
import { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  /** Max rotation in degrees. Default 6. */
  max?: number;
  /** Lift + scale applied on hover. */
  lift?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Cursor-aware 3D tilt for cards. The card rotates toward the pointer and
 * lifts slightly. Desktop pointers only; no-op on touch or reduced motion.
 * Wrap a card:  <Tilt className="card">…</Tilt>
 */
export default function Tilt({ children, max = 6, lift = 8, scale = 1.03, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const fine =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onPointerMove = (e: React.PointerEvent) => {
    if (!fine) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) ` +
      `rotateY(${(px * max).toFixed(2)}deg) translateY(-${lift}px) scale(${scale})`;
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        transition: 'transform 0.5s var(--ease-out)',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
