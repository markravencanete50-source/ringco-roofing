import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyMobileCta from '@/components/StickyMobileCta';
import { site } from '@/lib/content';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--f-display', display: 'swap' });
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Per-page schema lives in each page (LocalBusiness on Home/Contact,
            Service on service pages, FAQPage on FAQ sections, Organization on
            About) — intentionally not repeated site-wide here. */}
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyMobileCta />
      </body>
    </html>
  );
}
