'use client';

type Orb = {
  /** CSS color (use a token, e.g. 'var(--accent)' or 'var(--blue)'). */
  color: string;
  size: number;
  /** Position, any CSS length/percent. */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Peak opacity of the glow. Default 0.2. */
  opacity?: number;
  /** Animation: 'float' (orb) or 'drift' (aurora). */
  motion?: 'float' | 'drift';
  /** Seconds per loop. */
  duration?: number;
};

type Props = {
  orbs: Orb[];
  /** Extra className for the absolutely-positioned layer. */
  className?: string;
};

/**
 * Ambient moving-light layer for dark sections. Renders soft, blurred,
 * slowly drifting radial glows behind content. Purely decorative —
 * pointer-events: none, and animation is killed by the global reduced-motion
 * switch in globals.css. Place inside a `position: relative; overflow: hidden`
 * section, BEFORE the content, and give the section a higher-z content wrapper.
 *
 *   <section className="relative overflow-hidden">
 *     <Aurora orbs={[
 *       { color: 'var(--blue)',   size: 620, top: '-20%', left: '10%', motion: 'drift', duration: 24 },
 *       { color: 'var(--accent)', size: 540, bottom: '-25%', right: '4%', motion: 'drift', duration: 30 },
 *     ]} />
 *     <div className="relative z-10">…content…</div>
 *   </section>
 */
export default function Aurora({ orbs, className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {orbs.map((o, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            width: o.size,
            height: o.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, color-mix(in oklch, ${o.color} ${((o.opacity ?? 0.2) * 100).toFixed(0)}%, transparent), transparent 70%)`,
            filter: 'blur(30px)',
            animation: `${o.motion === 'drift' ? 'aurora-drift' : 'orb-float'} ${o.duration ?? 22}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes orb-float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(28px, -34px) scale(1.08); }
          66% { transform: translate(-22px, 20px) scale(0.94); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-drift {
          0% { transform: translate(-6%, -4%) rotate(0deg); }
          50% { transform: translate(6%, 4%) rotate(8deg); }
          100% { transform: translate(-6%, -4%) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
