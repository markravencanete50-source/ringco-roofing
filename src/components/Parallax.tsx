'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  /** How much slower than scroll the layer moves. 0.12 = very subtle. */
  factor?: number;
  className?: string;
};

/** Subtle parallax layer — child moves slower than scroll speed. Disabled under reduced motion. */
export default function Parallax({ children, factor = 0.12, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        setY(-center * factor);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [factor]);

  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${y}px, 0)` }}>
      {children}
    </div>
  );
}
