'use client';
import { useEffect, useState } from 'react';

/**
 * Slim reading-progress bar pinned to the very top of the viewport. Reflects
 * how far down the page the visitor has scrolled — a quiet, premium cue that
 * costs almost nothing. Width is driven by scroll position (not an animation),
 * so it stays meaningful under reduced-motion.
 */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div
        className="h-full transition-[width] duration-micro ease-out"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--blue), var(--accent-hi))',
          boxShadow: '0 0 10px color-mix(in oklch, var(--accent-hi) 60%, transparent)',
        }}
      />
    </div>
  );
}
