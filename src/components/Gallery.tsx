'use client';
import { useState } from 'react';
import BeforeAfter from './BeforeAfter';
import { projects } from '@/lib/content';

const filters = ['All', 'Roofing', 'Siding', 'Gutters'] as const;

/** Filterable before/after project gallery. */
export default function Gallery() {
  const [active, setActive] = useState<(typeof filters)[number]>('All');
  const list = active === 'All' ? projects : projects.filter((p) => p.service === active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={
              active === f
                ? 'rounded-full bg-accent px-5 py-2.5 font-display text-[14px] font-bold text-accent-ink'
                : 'rounded-full border border-line bg-card px-5 py-2.5 font-display text-[14px] font-bold text-ink transition-colors hover:border-accent-deep'
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {list.map((p) => (
          <BeforeAfter key={p.caption} before={p.before} after={p.after} caption={`${p.service} — ${p.caption}`} />
        ))}
      </div>
    </div>
  );
}
