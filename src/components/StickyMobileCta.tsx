'use client';
import Link from 'next/link';
import { site } from '@/lib/content';

export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[oklch(0.28_0.02_55)] bg-[oklch(0.14_0.02_50/0.96)] p-3 backdrop-blur-lg lg:hidden">
      <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[oklch(0.5_0.02_70)] py-3 font-display text-[14px] font-bold text-[oklch(0.96_0.01_80)]">
        Call now
      </a>
      <Link href="/contact" className="flex items-center justify-center rounded-full bg-accent py-3 font-display text-[14px] font-bold text-accent-ink">
        Free estimate
      </Link>
    </div>
  );
}
