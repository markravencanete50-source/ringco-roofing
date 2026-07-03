export const site = {
  name: 'Ringco Roofing and Construction',
  phone: '+1-405-470-7696',
  phoneDisplay: '(405) 470-7696',
  email: 'brantlon@ringcoconstruction.com',
  area: 'Oklahoma County, OK',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ringcoroofing.com',
  facebook: 'https://facebook.com/138247566963256',
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Insurance Claims', href: '/insurance-claims' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const services = [
  {
    slug: 'roofing',
    tag: 'Roofing',
    title: 'Roof Replacement & Repair',
    blurb:
      'GAF-certified installations built to survive Oklahoma hail and wind. Full tear-offs, repairs, and inspections backed by a 15-year labor warranty.',
    image:
      'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'siding',
    tag: 'Siding',
    title: 'Siding Installation',
    blurb:
      'Impact-resistant siding that protects and elevates your home. Precise, weather-tight installs with clean lines and a decade-plus lifespan.',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'gutters',
    tag: 'Gutters',
    title: 'Gutters & Drainage',
    blurb:
      'Seamless gutter systems that move water away from your foundation. Custom-fit, leaf-guarded, and engineered for Oklahoma downpours.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'insurance-claims',
    tag: 'Storm & Claims',
    title: 'Storm Damage & Insurance Claims',
    blurb:
      'We document the damage, meet your adjuster on-site, and manage the claim end-to-end — so you get the roof you are owed, not the one you settle for.',
    image:
      'https://images.unsplash.com/photo-1523867904486-2cd4d5b13d40?auto=format&fit=crop&w=1200&q=80',
  },
];

export const steps = [
  { n: '01', title: 'Free inspection', body: 'We assess your roof, document every point of damage, and give you a straight answer — no pressure, no upsell.' },
  { n: '02', title: 'We meet your adjuster', body: 'We stand on the roof with your insurance adjuster to make sure nothing legitimate gets missed or denied.' },
  { n: '03', title: 'Approval & scheduling', body: 'Once the claim is approved, we schedule around your life and order premium materials up front.' },
  { n: '04', title: 'Install & warranty', body: 'A clean, fast install by our own crews — finished with a 15-year labor warranty and a spotless site.' },
];

export const stats = [
  { v: '15', suffix: 'yr', label: 'Labor warranty' },
  { v: '1,200', suffix: '+', label: 'Roofs completed' },
  { v: '24/7', suffix: '', label: 'Emergency response' },
  { v: '100', suffix: '%', label: 'Family owned' },
];

export const reviews = [
  { quote: 'Ringco caught hail damage two other companies missed, met our adjuster, and had a new roof on in a day. The claim was fully approved.', name: 'Danielle R.', role: 'Edmond, OK' },
  { quote: 'Straightforward, no games. They told me what I actually needed and the crew left the yard cleaner than they found it.', name: 'Marcus T.', role: 'Oklahoma City, OK' },
  { quote: 'From the free inspection to the final walkthrough, it felt like dealing with family. The 15-year warranty sealed it.', name: 'Priya S.', role: 'Moore, OK' },
];

export const certs = [
  { badge: 'GAF', kind: 'gaf', title: 'GAF Certified', body: 'Factory-certified installer held to GAF quality and warranty standards.' },
  { badge: 'A+', kind: 'bbb', title: 'BBB Accredited', body: 'Accredited business with a track record of resolved, satisfied customers.' },
  { badge: '15', kind: 'gaf', title: '15-Year Warranty', body: 'Industry-leading labor warranty on every full roof replacement.' },
];
