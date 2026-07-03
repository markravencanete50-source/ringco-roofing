'use client';
import { useMemo, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { clsx } from './clsx';

export type GalleryItem = {
  id: string;
  publicId: string;
  title: string;
  category: string;
};

const CATEGORIES = ['All', 'Roofing', 'Siding', 'Gutters', 'Storm'];

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [cat, setCat] = useState('All');
  const [active, setActive] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => (cat === 'All' ? items : items.filter((i) => i.category === cat)),
    [items, cat],
  );

  if (!items.length)
    return (
      <div className="rounded-3xl border border-line bg-card p-14 text-center">
        <p className="font-display text-[20px] font-bold">Project photos are on the way.</p>
        <p className="mt-2 text-muted">Our latest roofs, siding and gutter jobs will appear here soon.</p>
      </div>
    );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={clsx(
              'rounded-full px-5 py-2.5 font-display text-[14px] font-bold transition-colors',
              cat === c ? 'bg-accent text-accent-ink' : 'border border-line text-muted hover:border-accent-deep',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item)}
            className="group relative block w-full overflow-hidden rounded-2xl bg-[oklch(0.85_0.01_80)] text-left"
          >
            <CldImage
              src={item.publicId}
              alt={item.title}
              width={800}
              height={600}
              crop="fill"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,oklch(0.12_0.02_50/0.85),transparent)] p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="font-display text-[14px] font-bold text-white">{item.title}</span>
              <span className="ml-2 text-[12px] text-[oklch(0.8_0.02_70)]">{item.category}</span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[oklch(0.1_0.02_50/0.92)] p-4"
          onClick={() => setActive(null)}
        >
          <button aria-label="Close" className="absolute right-6 top-6 font-display text-3xl text-white/70 hover:text-white">×</button>
          <div className="max-h-[85vh] max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
            <CldImage src={active.publicId} alt={active.title} width={1600} height={1200} className="max-h-[85vh] w-auto rounded-xl object-contain" />
            <p className="mt-3 text-center font-display text-[15px] font-semibold text-white">{active.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
