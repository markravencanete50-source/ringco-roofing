'use client';
import { useEffect, useRef, useState } from 'react';

type Variant = 'up' | 'left' | 'right' | 'pop' | 'drop' | 'grow';

type Props = {
  children: React.ReactNode;
  /** Direction/style of the reveal. Default 'up' (matches the original Reveal). */
  variant?: Variant;
  /** Delay in seconds before the reveal transition starts. */
  delay?: number;
  className?: string;
};

const FROM: Record<Variant, string> = {
  up: 'translateY(28px)',
  left: 'translateX(-32px)',
  right: 'translateX(32px)',
  pop: 'scale(0.84)',
  drop: 'translateY(-28px)',
  grow: 'scaleX(0)',
};

/**
 * Fades + transforms children in when they enter the viewport.
 * Drop-in superset of the original Reveal: default variant 'up' is identical.
 * Renders visible immediately under reduced motion or no IntersectionObserver.
 */
export default function Reveal({ children, variant = 'up', delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : FROM[variant],
        transformOrigin: variant === 'grow' ? 'left' : undefined,
        transition: `opacity var(--dur-section, 0.75s) var(--ease-out) ${delay}s, transform var(--dur-section, 0.75s) var(--ease-out) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
