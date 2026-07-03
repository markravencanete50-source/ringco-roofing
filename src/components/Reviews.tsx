'use client';
import { useState } from 'react';
import { reviews } from '@/lib/content';

export default function Reviews() {
  const [i, setI] = useState(0);
  const r = reviews[i];
  return (
    <section className="bg-panel px-[6vw] py-28">
      <div className="mx-auto max-w-wrap">
        <p className="eyebrow text-blue">What neighbors say</p>
        <h2 className="mt-3.5 font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">Rated for the work, not the pitch.</h2>

        <div className="mt-10 max-w-[820px]">
          <div className="mb-5 text-[20px] tracking-[0.1em] text-accent">★★★★★</div>
          <p className="min-h-[120px] font-display text-[clamp(20px,2.4vw,30px)] font-medium leading-snug text-[oklch(0.94_0.01_80)]">&ldquo;{r.quote}&rdquo;</p>
          <div className="mt-6 font-display font-bold text-[oklch(0.98_0.01_80)]">{r.name}</div>
          <div className="text-[14px] text-[oklch(0.6_0.02_60)]">{r.role}</div>

          <div className="mt-8 flex gap-2.5">
            {reviews.map((_, k) => (
              <button key={k} aria-label={`Review ${k + 1}`} onClick={() => setI(k)} className={`h-2.5 w-2.5 rounded-full transition-colors ${k === i ? 'bg-accent' : 'bg-[oklch(0.35_0.02_55)]'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
