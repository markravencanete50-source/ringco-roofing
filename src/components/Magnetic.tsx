'use client';
import { cloneElement, useRef } from 'react';

type MagneticChildProps = {
  ref?: React.Ref<HTMLElement>;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerLeave?: () => void;
  style?: React.CSSProperties;
};

type Props = {
  /** A single ref-forwarding element (button/anchor) — e.g. <Button> or <a>. */
  children: React.ReactElement<MagneticChildProps>;
  /** How far the element trails the cursor. 0.28 ≈ subtle. */
  strength?: number;
};

/**
 * Magnetic hover: the wrapped element eases toward the cursor while hovered,
 * then snaps back. Desktop pointers only; no-op on touch or reduced motion.
 * Wrap a single element that forwards ref + style (a button/anchor):
 *   <Magnetic><Button href="/contact">Get a free estimate</Button></Magnetic>
 */
export default function Magnetic({ children, strength = 0.28 }: Props) {
  const ref = useRef<HTMLElement>(null);

  const fine = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onPointerMove = (e: React.PointerEvent) => {
    if (!fine()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(mx * strength).toFixed(1)}px, ${(my * strength - 3).toFixed(1)}px)`;
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return cloneElement(children, {
    ref,
    onPointerMove,
    onPointerLeave,
    style: {
      transition: 'transform var(--dur-comp, 0.4s) var(--ease-out)',
      ...(children.props.style || {}),
    },
  });
}
