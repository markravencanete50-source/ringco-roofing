'use client';
import { useEffect, useRef, useState } from 'react';
import BASlider from './BASlider';
import MediaImg from './MediaImg';
import { galleryItems, categoryColors, type GalleryItem } from '@/lib/content';
import { clsx } from './clsx';

const TABS = [
  { id: 'all', label: 'All projects' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'siding', label: 'Siding' },
  { id: 'gutters', label: 'Gutters' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/** Looping drone clip in-card; falls back to the after-photo if the file is missing. */
function CardMedia({ item }: { item: GalleryItem }) {
  const [videoFailed, setVideoFailed] = useState(false);
  if (item.video && !videoFailed) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-t-[18px] bg-[oklch(0.7_0.02_90)]">
        <video
          className="h-full w-full object-cover transition-transform duration-section ease-out group-hover:scale-[1.05]"
          autoPlay muted loop playsInline
          onError={() => setVideoFailed(true)}
          src={item.video}
        />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[oklch(0.15_0.02_50/0.85)] px-3 py-1.5 font-display text-[11px] font-bold tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-hi" /> DRONE — FINISHED JOB
        </span>
      </div>
    );
  }
  return <BASlider before={item.before} after={item.after} aspect="aspect-video" rounded="rounded-t-[18px]" altBefore={`${item.title} — before`} altAfter={`${item.title} — after`} />;
}

export default function GalleryGrid() {
  const [tab, setTab] = useState<TabId>('all');
  const [visibleTab, setVisibleTab] = useState<TabId>('all');
  const [fading, setFading] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const wrap = tabsRef.current;
    const el = tabRefs.current[tab];
    if (!wrap || !el) return;
    const w = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBar({ left: r.left - w.left, width: r.width });
  }, [tab]);

  // Fade-out → swap → fade-in on filter change (no hard cut)
  useEffect(() => {
    if (tab === visibleTab) return;
    setFading(true);
    const t = setTimeout(() => {
      setVisibleTab(tab);
      setFading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [tab, visibleTab]);

  // Lightbox: esc to close, lock scroll
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const items = visibleTab === 'all' ? galleryItems : galleryItems.filter((g) => g.category === visibleTab);

  return (
    <>
      {/* Filter tabs with sliding active indicator */}
      <div ref={tabsRef} className="relative inline-flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[t.id] = el; }}
            onClick={() => setTab(t.id)}
            className={clsx(
              'px-4 pb-3.5 pt-2 font-display text-[15px] font-bold transition-colors duration-micro',
              tab === t.id ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
        <span aria-hidden className="absolute bottom-[-1px] h-[2.5px] rounded-full bg-accent transition-[left,width] duration-comp ease-out" style={{ left: bar.left, width: bar.width }} />
      </div>

      <div className={clsx('mt-10 grid gap-8 transition-opacity duration-micro md:grid-cols-2', fading ? 'opacity-0' : 'opacity-100')}>
        {items.map((g) => (
          <div key={g.id} className="group overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_24px_50px_-38px_oklch(0.2_0.02_60/0.5)] transition-[transform,box-shadow,border-color] duration-comp ease-out hover:-translate-y-1.5 hover:border-[oklch(0.62_0.155_40/0.45)] hover:shadow-[0_34px_60px_-34px_oklch(0.2_0.02_60/0.62)]">
            <CardMedia item={g} />
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <div className="mb-1.5 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: categoryColors[g.category] }} />
                  <span className="font-mono text-[11px] tracking-[0.14em] text-muted">{g.city.toUpperCase()}</span>
                </div>
                <h3 className="font-display text-[19px] font-bold">{g.title}</h3>
                <p className="mt-1 text-[13.5px] text-muted">{g.scope}</p>
              </div>
              <button
                onClick={() => setLightbox(g)}
                className="shrink-0 rounded-full border-[1.5px] border-line px-4 py-2 font-display text-[13px] font-bold text-ink transition-colors duration-micro hover:border-accent hover:text-accent-deep"
                aria-label={`Expand ${g.title}`}
              >
                Expand ⤢
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen lightbox — same drag-slider, larger, for inspecting quality */}
      {lightbox ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[oklch(0.1_0.015_50/0.92)] p-[4vw] backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <div className="w-full max-w-[1200px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-[22px] font-bold text-[oklch(0.98_0.01_80)]">{lightbox.title}</h3>
                <p className="text-[14px] text-[oklch(0.7_0.02_60)]">{lightbox.city} · {lightbox.scope}</p>
              </div>
              <button onClick={() => setLightbox(null)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[oklch(0.4_0.02_60)] text-[20px] text-[oklch(0.95_0.01_80)] transition-colors duration-micro hover:border-accent-hi hover:text-accent-hi" aria-label="Close">
                ×
              </button>
            </div>
            {lightbox.video ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-[oklch(0.2_0.02_50)]">
                <video className="h-full w-full object-cover" autoPlay muted loop playsInline controls src={lightbox.video}
                  onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }} />
                <div className="absolute inset-0 -z-[1]">
                  <MediaImg src={lightbox.after} alt={lightbox.title} slotLabel="after photo" />
                </div>
              </div>
            ) : (
              <BASlider before={lightbox.before} after={lightbox.after} aspect="aspect-video" altBefore={`${lightbox.title} — before`} altAfter={`${lightbox.title} — after`} />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
