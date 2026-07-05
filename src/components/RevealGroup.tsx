'use client';
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  /** Stagger step between children, in seconds. Default 0.09. */
  step?: number;
  /** Max delay cap so long lists don't drag, in seconds. Default 0.5. */
  max?: number;
  className?: string;
};

/**
 * Reveals direct children one after another as the group enters the viewport.
 * Each child fades + slides up with an increasing delay.
 * Use for grids/rows of cards (services, stats, gallery).
 */
export default function RevealGroup({ children, step = 0.09, max = 0.5, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => {
        const delay = Math.min(i * step, max);
        const style: React.CSSProperties = {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(26px)',
          transition: `opacity var(--dur-section, 0.7s) var(--ease-out) ${delay}s, transform var(--dur-section, 0.7s) var(--ease-out) ${delay}s`,
          willChange: 'opacity, transform',
        };
        if (isValidElement(child)) {
          const el = child as React.ReactElement<{ style?: React.CSSProperties }>;
          return cloneElement(el, {
            key: i,
            style: { ...style, ...(el.props.style || {}) },
          });
        }
        return (
          <div key={i} style={style}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
