'use client';
import { useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import { team } from '@/lib/content';

/**
 * Team grid. Photos are the win here, not effects — subtle
 * grayscale-to-color on hover once real photos exist; a clean
 * initials placeholder until then.
 * Media slots: /media/team/*.jpg (see MEDIA.md)
 */
function Photo({ src, name, initials }: { src: string; name: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(-45deg,oklch(0.88_0.012_75)_0px,oklch(0.88_0.012_75)_14px,oklch(0.92_0.010_78)_14px,oklch(0.92_0.010_78)_28px)]">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[oklch(0.99_0.005_80)] font-display text-[26px] font-bold text-accent-deep">{initials}</span>
        <span className="rounded-md bg-[oklch(0.99_0.005_80/0.85)] px-2.5 py-1 font-mono text-[10.5px] text-[oklch(0.4_0.02_60)]">photo coming soon</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes="(max-width:768px) 100vw, 33vw"
      unoptimized
      onError={() => setFailed(true)}
      className="object-cover grayscale-[35%] transition-[filter,transform] duration-comp ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
    />
  );
}

export default function TeamGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {team.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.08}>
          <div className="group h-full overflow-hidden rounded-3xl border border-line bg-card">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Photo src={t.photo} name={t.name} initials={t.initials} />
            </div>
            <div className="p-6">
              <h3 className="font-display text-[21px] font-bold">{t.name}</h3>
              <p className="mb-2.5 text-[13.5px] font-bold uppercase tracking-wide text-accent-deep">{t.role}</p>
              <p className="text-[14.5px] leading-relaxed text-muted">{t.bio}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
