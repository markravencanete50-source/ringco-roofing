'use client';
import { useEffect, useRef, useState } from 'react';
import { stats } from '@/lib/content';

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  const isNum = !Number.isNaN(numeric) && value.match(/^[0-9,]+$/);

  useEffect(() => {
    if (!isNum || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const dur = 1200; const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(Math.round(numeric * eased).toLocaleString());
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [isNum, numeric]);

  return <span ref={ref}>{isNum ? shown : value}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="bg-panel px-[6vw] pb-28">
      <div className="mx-auto grid max-w-wrap gap-8 rounded-3xl border border-[oklch(0.26_0.02_55)] bg-[oklch(0.19_0.02_50)] px-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-[clamp(36px,5vw,54px)] font-bold text-[oklch(0.98_0.01_80)]"><Counter value={s.v} suffix={s.suffix} /></div>
            <div className="mt-1 text-[14px] font-semibold uppercase tracking-wide text-[oklch(0.6_0.02_60)]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
