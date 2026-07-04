'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { nav } from '@/lib/content';
import Tel from './Tel';
import { clsx } from './clsx';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 border-b transition-[height,background,border-color] duration-300',
        scrolled
          ? 'h-[72px] border-[oklch(0.28_0.02_55)] bg-[oklch(0.14_0.02_50/0.92)] backdrop-blur-lg'
          : 'h-[92px] border-transparent bg-[oklch(0.14_0.02_50/0.35)] backdrop-blur-md',
      )}
    >
      <div className="flex h-full items-center justify-between px-[6vw]">
        <Link href="/" className="flex items-center gap-3" aria-label="Ringco Roofing home">
          <span className="flex flex-col items-center">
            <span className="h-0 w-0 border-x-[11px] border-b-[13px] border-x-transparent border-b-accent" />
            <span className="-mt-px h-[9px] w-[22px] rounded-b-sm bg-accent-deep" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[20px] font-bold tracking-wide text-[oklch(0.98_0.01_80)]">RINGCO</span>
            <span className="text-[10px] font-semibold tracking-[0.16em] text-[oklch(0.70_0.02_60)]">ROOFING &amp; CONSTRUCTION</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap py-2 text-[13.5px] font-semibold text-[oklch(0.90_0.01_70)] transition-colors hover:text-accent-hi">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Tel withDot className="whitespace-nowrap font-display text-[13.5px] font-bold text-[oklch(0.98_0.01_80)]" />

          <Link href="/contact" className="rounded-full bg-accent px-[18px] py-[11px] font-display text-[13px] font-bold text-accent-ink transition-colors hover:bg-accent-hi">
            Free Estimate
          </Link>
        </div>

        <button className="flex h-[38px] w-[38px] flex-col items-center justify-center gap-[5px] lg:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className={clsx('h-0.5 w-6 bg-[oklch(0.95_0.01_80)] transition-transform', open && 'translate-y-[7px] rotate-45')} />
          <span className={clsx('h-0.5 w-6 bg-[oklch(0.95_0.01_80)] transition-opacity', open && 'opacity-0')} />
          <span className={clsx('h-0.5 w-6 bg-[oklch(0.95_0.01_80)] transition-transform', open && '-translate-y-[7px] -rotate-45')} />
        </button>
      </div>

      <div className={clsx('flex flex-col gap-1 overflow-hidden bg-panel-2 px-[6vw] transition-[max-height,opacity] duration-300 lg:hidden', open ? 'max-h-[420px] py-5 opacity-100' : 'max-h-0 opacity-0')}>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-1.5 font-display text-[19px] font-semibold text-[oklch(0.95_0.01_80)]">
            {n.label}
          </Link>
        ))}
        <Tel className="py-1.5 font-display text-[19px] font-bold text-accent-hi" />
        <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-accent px-[22px] py-3.5 text-center font-display font-bold text-accent-ink">
          Free Estimate
        </Link>
      </div>
    </header>
  );
}
