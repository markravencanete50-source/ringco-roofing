import Reveal from './Reveal';
import { cities } from '@/lib/content';

type Props = {
  compact?: boolean;
};

/**
 * Static styled service-area map: dot-grid panel with positioned city pins.
 * Spatial trust ("do they serve my suburb?") beats a text list.
 * Used on About and Contact for consistency.
 */
export default function AreaMap({ compact }: Props) {
  return (
    <Reveal>
      <div
        className={`relative w-full overflow-hidden rounded-3xl border border-[oklch(0.26_0.02_55)] bg-panel-2 ${compact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}
        style={{
          backgroundImage: 'radial-gradient(oklch(0.30 0.02 55) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        role="img"
        aria-label={`Service area map: ${cities.map((c) => c.name).join(', ')}`}
      >
        <span className="absolute left-5 top-5 font-mono text-[11px] tracking-[0.2em] text-[oklch(0.55_0.02_60)]">
          OKLAHOMA COUNTY &amp; SURROUNDING
        </span>

        {cities.map((c, i) => (
          <span
            key={c.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <span className="flex flex-col items-center gap-1">
              <span
                className={
                  'hq' in c && c.hq
                    ? 'h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_0_5px_oklch(0.62_0.155_40/0.22)] animate-pulseRing'
                    : 'h-2.5 w-2.5 rounded-full border border-[oklch(0.14_0.02_50)] bg-accent-hi'
                }
              />
              <span
                className={`whitespace-nowrap font-display font-semibold ${'hq' in c && c.hq ? 'text-[oklch(0.98_0.01_80)]' : 'text-[oklch(0.78_0.02_60)]'}`}
                style={{ fontSize: compact ? 10 : 12 }}
              >
                {c.name}
              </span>
            </span>
          </span>
        ))}

        <span className="absolute bottom-5 right-5 rounded-full border border-[oklch(0.3_0.02_55)] bg-[oklch(0.16_0.02_50/0.8)] px-3.5 py-1.5 font-display text-[11.5px] font-bold text-[oklch(0.85_0.02_70)]">
          {cities.length} cities served — and growing
        </span>
      </div>
    </Reveal>
  );
}
