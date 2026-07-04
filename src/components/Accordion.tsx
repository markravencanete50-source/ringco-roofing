'use client';
import { useState } from 'react';
import { clsx } from './clsx';

type Item = { q: string; a: string };

/**
 * FAQ accordion with an eased height transition (grid-rows trick, no snap)
 * and a rotating + icon. Dark-panel styling.
 */
export default function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[oklch(0.26_0.02_55)]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="py-2">
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-6 py-4 text-left font-display text-[18px] font-bold text-[oklch(0.95_0.01_80)]"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {f.q}
              <span className={clsx('shrink-0 text-[22px] leading-none text-accent-hi transition-transform duration-comp ease-out', isOpen && 'rotate-45')}>+</span>
            </button>
            <div className={clsx('grid transition-[grid-template-rows,opacity] duration-comp ease-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 text-[16px] leading-relaxed text-[oklch(0.72_0.02_60)]">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
