import Link from 'next/link';
import { nav, site } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-panel-3 px-[6vw] pb-8 pt-20 text-[oklch(0.75_0.02_60)]">
      <div className="mx-auto grid max-w-wrap gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-4 font-display text-[22px] font-bold tracking-wide text-[oklch(0.98_0.01_80)]">RINGCO</div>
          <p className="max-w-sm text-[15px] leading-relaxed">
            Family-owned roofing, siding, gutter and insurance-claim specialists serving {site.area}. GAF certified, 24/7 emergency service, and a 15-year labor warranty on every roof.
          </p>
          <a href={`tel:${site.phone}`} className="mt-5 inline-block font-display text-[20px] font-bold text-accent-hi">{site.phoneDisplay}</a>
        </div>

        <div>
          <div className="eyebrow mb-4 text-[oklch(0.6_0.02_60)]">Explore</div>
          <ul className="space-y-2.5 text-[15px]">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="transition-colors hover:text-accent-hi">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 text-[oklch(0.6_0.02_60)]">Get in touch</div>
          <ul className="space-y-2.5 text-[15px]">
            <li><a href={`mailto:${site.email}`} className="transition-colors hover:text-accent-hi break-all">{site.email}</a></li>
            <li>{site.area}</li>
            <li><a href={site.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-hi">Facebook</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-wrap flex-col justify-between gap-3 border-t border-[oklch(0.24_0.02_55)] pt-6 text-[13px] text-[oklch(0.55_0.02_60)] sm:flex-row">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>GAF Certified · BBB Accredited · Licensed &amp; Insured</span>
      </div>
    </footer>
  );
}
