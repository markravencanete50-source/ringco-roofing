'use client';
import { useState } from 'react';
import Image from 'next/image';
import { clsx } from './clsx';

type Props = {
  src: string;
  alt: string;
  /** Monospace label shown on the striped placeholder if the file is missing. */
  slotLabel?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * next/image with a graceful fallback: if the local media file 404s
 * (before the client has dropped their real photos into /public/media),
 * a subtly-striped placeholder with a monospace slot label renders instead.
 */
export default function MediaImg({ src, alt, slotLabel, sizes = '100vw', priority, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(-45deg,oklch(0.88_0.012_75)_0px,oklch(0.88_0.012_75)_14px,oklch(0.92_0.010_78)_14px,oklch(0.92_0.010_78)_28px)]"
      >
        <span className="rounded-md bg-[oklch(0.99_0.005_80/0.85)] px-3 py-1.5 font-mono text-[11px] tracking-wide text-[oklch(0.4_0.02_60)]">
          {slotLabel ?? src}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
      className={clsx('object-cover', className)}
    />
  );
}
