const items = ['GAF Certified', '15-Year Labor Warranty', 'Insurance Claim Specialists', '24/7 Emergency Response', '1,200+ Roofs Completed', 'Family Owned & Operated', 'Licensed & Insured'];

/** True CSS marquee (translateX loop), ~40s per loop, pauses on hover/tap. */
export default function Marquee() {
  const loop = [...items, ...items];
  return (
    <div className="group overflow-hidden border-y border-[oklch(0.26_0.02_55)] bg-panel-2 py-4">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-7 whitespace-nowrap px-7 font-display text-[14px] font-bold tracking-wide text-[oklch(0.55_0.02_60)]">
            {t} <b className="font-normal text-accent">/</b>
          </span>
        ))}
      </div>
    </div>
  );
}
