'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/lib/content';
import { clsx } from './clsx';

/**
 * Fixed header: transparent over hero → solid + shadow past 80px.
 * Active nav link gets an animated underline that slides between links.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [bar, setBar] = useState<{ left: number; width: number; visible: boolean }>({ left: 0, width: 0, visible: false });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const moveBarTo = useCallback((href: string | null) => {
    const wrap = navRef.current;
    const el = href ? linkRefs.current[href] : null;
    if (!wrap || !el) {
      setBar((b) => ({ ...b, visible: false }));
      return;
    }
    const w = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBar({ left: r.left - w.left, width: r.width, visible: true });
  }, []);

  const activeHref = nav.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'))?.href ?? null;

  useEffect(() => {
    moveBarTo(activeHref);
    const onResize = () => moveBarTo(activeHref);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeHref, moveBarTo]);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 border-b transition-[height,background-color,border-color,box-shadow] duration-comp ease-out',
        scrolled
          ? 'h-[72px] border-[oklch(0.28_0.02_55)] bg-[oklch(0.14_0.02_50/0.94)] shadow-[0_10px_30px_-18px_oklch(0_0_0/0.55)] backdrop-blur-lg'
          : 'h-[92px] border-transparent bg-[oklch(0.14_0.02_50/0.35)] backdrop-blur-md',
      )}
    >
      <div className="flex h-full items-center justify-between px-[6vw]">
        <Link href="/" className="flex items-center gap-3" aria-label="Ringco Roofing home">
          <span className="flex flex-col items-center">
            <span className={clsx('h-0 w-0 border-x-transparent border-b-accent transition-all duration-comp ease-out', scrolled ? 'border-x-[9px] border-b-[11px]' : 'border-x-[11px] border-b-[13px]')} />
            <span className={clsx('-mt-px rounded-b-sm bg-accent-deep transition-all duration-comp ease-out', scrolled ? 'h-[7px] w-[18px]' : 'h-[9px] w-[22px]')} />
          </span>
          <span className="flex flex-col leading-none">
            <span className={clsx('font-display font-bold tracking-wide text-[oklch(0.98_0.01_80)] transition-[font-size] duration-comp ease-out', scrolled ? 'text-[18px]' : 'text-[20px]')}>RINGCO</span>
            <span className="text-[10px] font-semibold tracking-[0.16em] text-[oklch(0.70_0.02_60)]">ROOFING &amp; CONSTRUCTION</span>
          </span>
        </Link>

        <nav ref={navRef} className="relative hidden items-center gap-5 lg:flex" onMouseLeave={() => moveBarTo(activeHref)}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              ref={(el) => { linkRefs.current[n.href] = el; }}
              onMouseEnter={() => moveBarTo(n.href)}
              className={clsx(
                'whitespace-nowrap py-2 text-[13.5px] font-semibold transition-colors duration-micro',
                activeHref === n.href ? 'text-[oklch(0.98_0.01_80)]' : 'text-[oklch(0.90_0.01_70)] hover:text-[oklch(0.98_0.01_80)]',
              )}
            >
              {n.label}
            </Link>
          ))}
          <span
            aria-hidden
            className="absolute bottom-0 h-[2px] rounded-full bg-accent-hi transition-[left,width,opacity] duration-comp ease-out"
            style={{ left: bar.left, width: bar.width, opacity: bar.visible ? 1 : 0 }}
          />
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={`tel:${site.phone}`} className="flex items-center gap-2 whitespace-nowrap font-display text-[14px] font-bold text-[oklch(0.98_0.01_80)]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulseRing" />
            {site.phoneDisplay}
          </a>
          <Link href="/contact" className="rounded-full bg-accent px-[18px] py-[11px] font-display text-[14px] font-bold text-accent-ink transition-colors duration-micro hover:bg-accent-hi">
            Free Estimate
          </Link>
        </div>

        <button className="flex h-[38px] w-[38px] flex-col items-center justify-center gap-[5px] lg:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className={clsx('h-0.5 w-6 bg-[oklch(0.95_0.01_80)] transition-transform duration-micro', open && 'translate-y-[7px] rotate-45')} />
          <span className={clsx('h-0.5 w-6 bg-[oklch(0.95_0.01_80)] transition-opacity duration-micro', open && 'opacity-0')} />
          <span className={clsx('h-0.5 w-6 bg-[oklch(0.95_0.01_80)] transition-transform duration-micro', open && '-translate-y-[7px] -rotate-45')} />
        </button>
      </div>

      <div className={clsx('flex flex-col gap-1 overflow-hidden bg-panel-2 px-[6vw] transition-[max-height,opacity] duration-comp ease-out lg:hidden', open ? 'max-h-[440px] py-5 opacity-100' : 'max-h-0 opacity-0')}>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={clsx('py-1.5 font-display text-[19px] font-semibold', activeHref === n.href ? 'text-accent-hi' : 'text-[oklch(0.95_0.01_80)]')}>
            {n.label}
          </Link>
        ))}
        <a href={`tel:${site.phone}`} className="py-1.5 font-display text-[19px] font-bold text-accent-hi">{site.phoneDisplay}</a>
        <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-accent px-[22px] py-3.5 text-center font-display font-bold text-accent-ink">
          Free Estimate
        </Link>
      </div>
    </header>
  );
}
