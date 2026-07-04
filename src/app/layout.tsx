import type { Metadata } from 'next';
import { Zilla_Slab, Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyMobileCta from '@/components/StickyMobileCta';
import { site } from '@/lib/content';

const display = Zilla_Slab({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--f-display', display: 'swap' });
const body = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--f-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Ringco Roofing and Construction | Roofing, Siding & Gutters — Oklahoma County, OK',
  description:
    'Family-owned roofing, siding, gutter & insurance-claim experts serving Oklahoma County, OK. 15-year labor warranty, GAF certified, 24/7 emergency service. Free estimates.',
  openGraph: {
    title: 'Ringco Roofing and Construction | Oklahoma County, OK',
    description: 'Family-owned roofing, siding, gutter & insurance-claim experts. 15-year labor warranty. GAF certified. 24/7 emergency service.',
    type: 'website',
    url: site.url,
  },
  alternates: { canonical: site.url },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: site.name,
  telephone: site.phone,
  email: site.email,
  areaServed: site.area,
  address: { '@type': 'PostalAddress', addressRegion: 'OK', addressCountry: 'US' },
  sameAs: [site.facebook],
  priceRange: '$$',
  description:
    'Family-owned roofing, siding, gutter and insurance-claim specialists serving Oklahoma County, OK with a 15-year labor warranty and 24/7 emergency service.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyMobileCta />
      </body>
    </html>
  );
}
