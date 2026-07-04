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

/** Category accent colors — same lightness/chroma family, hue varies. */
export const categoryColors: Record<string, string> = {
  roofing: 'oklch(0.62 0.15 40)',
  siding: 'oklch(0.62 0.10 230)',
  gutters: 'oklch(0.62 0.10 160)',
  'insurance-claims': 'oklch(0.62 0.10 300)',
};

export const services = [
  {
    slug: 'roofing',
    tag: 'Roofing',
    title: 'Roof Replacement & Repair',
    blurb:
      'GAF-certified installations built to survive Oklahoma hail and wind. Full tear-offs, repairs, and inspections backed by a 15-year labor warranty.',
    image: '/media/services/roofing.jpg',
    included: ['Full tear-off & replacement', 'Repairs & leak tracing', 'Free 21-point inspection', '15-year labor warranty'],
  },
  {
    slug: 'siding',
    tag: 'Siding',
    title: 'Siding Installation',
    blurb:
      'Impact-resistant siding that protects and elevates your home. Precise, weather-tight installs with clean lines and a decade-plus lifespan.',
    image: '/media/services/siding.jpg',
    included: ['Vinyl & fiber-cement install', 'Storm-damage replacement', 'Trim, soffit & fascia', 'Color-matched finishes'],
  },
  {
    slug: 'gutters',
    tag: 'Gutters',
    title: 'Gutters & Drainage',
    blurb:
      'Seamless gutter systems that move water away from your foundation. Custom-fit, leaf-guarded, and engineered for Oklahoma downpours.',
    image: '/media/services/gutters.jpg',
    included: ['Seamless gutter runs', 'Leaf guards & screens', 'Downspout & drainage design', 'Repairs & re-pitching'],
  },
  {
    slug: 'insurance-claims',
    tag: 'Storm & Claims',
    title: 'Storm Damage & Insurance Claims',
    blurb:
      'We document the damage, meet your adjuster on-site, and manage the claim end-to-end — so you get the roof you are owed, not the one you settle for.',
    image: '/media/services/storm.jpg',
    included: ['Free storm inspection', 'Adjuster meeting on-site', 'Full claim documentation', 'Code-compliant supplements'],
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
  { quote: 'Hail totaled our roof in April. Ringco handled the whole claim — the adjuster meeting, the paperwork, everything. New Class 4 roof by June.', name: 'Jordan W.', role: 'Yukon, OK' },
  { quote: 'They re-opened a claim another company told us was dead. Insurance ended up covering the full replacement.', name: 'Alyssa K.', role: 'Midwest City, OK' },
];

export const certs = [
  { badge: 'GAF', kind: 'gaf', title: 'GAF Certified', body: 'Factory-certified installer held to GAF quality and warranty standards.' },
  { badge: 'A+', kind: 'bbb', title: 'BBB Accredited', body: 'Accredited business with a track record of resolved, satisfied customers.' },
  { badge: '15', kind: 'gaf', title: '15-Year Warranty', body: 'Industry-leading labor warranty on every full roof replacement.' },
];

/** Service-area cities with approximate map positions (percent coords, N up). */
export const cities = [
  { name: 'Oklahoma City', x: 45, y: 54, hq: true },
  { name: 'Edmond', x: 52, y: 20 },
  { name: 'The Village', x: 47, y: 33 },
  { name: 'Nichols Hills', x: 44, y: 40 },
  { name: 'Warr Acres', x: 35, y: 43 },
  { name: 'Bethany', x: 32, y: 49 },
  { name: 'Yukon', x: 20, y: 53 },
  { name: 'Mustang', x: 19, y: 70 },
  { name: 'Moore', x: 49, y: 76 },
  { name: 'Norman', x: 56, y: 90 },
  { name: 'Del City', x: 58, y: 60 },
  { name: 'Midwest City', x: 64, y: 54 },
  { name: 'Choctaw', x: 77, y: 52 },
  { name: 'Harrah', x: 88, y: 55 },
  { name: 'Piedmont', x: 24, y: 16 },
];

export const team = [
  {
    name: 'Brantlon Ring',
    role: 'Owner & Founder',
    initials: 'BR',
    photo: '/media/team/brantlon.jpg',
    bio: 'Started Ringco to do storm claims the honest way: document everything, meet every adjuster, and stand behind the work for 15 years.',
  },
  {
    name: 'Blake',
    role: 'Operations & Project Manager',
    initials: 'B',
    photo: '/media/team/blake.jpg',
    bio: 'Runs every job from material order to final walkthrough — one point of contact from the first ladder to the last nail.',
  },
  {
    name: 'Victor',
    role: 'Lead Crew Foreman',
    initials: 'V',
    photo: '/media/team/victor.jpg',
    bio: 'Leads the install crew that finishes most residential roofs in a single day — and leaves the yard cleaner than it started.',
  },
];

export type GalleryItem = {
  id: string;
  category: 'roofing' | 'siding' | 'gutters';
  title: string;
  city: string;
  scope: string;
  before: string;
  after: string;
  /** Optional looping drone clip of the finished job — shown in-card instead of the after photo. */
  video?: string;
};

export const galleryItems: GalleryItem[] = [
  { id: 'job-01', category: 'roofing', title: 'Full replacement after April hail', city: 'Edmond, OK', scope: 'Tear-off · Class 4 shingles · Insurance claim', before: '/media/gallery/job-01-before.jpg', after: '/media/gallery/job-01-after.jpg', video: '/media/gallery/job-01-drone.mp4' },
  { id: 'job-02', category: 'roofing', title: 'Wind-lifted ridge, one-day rebuild', city: 'Moore, OK', scope: 'Tear-off · GAF Timberline HDZ · Ridge vent', before: '/media/gallery/job-02-before.jpg', after: '/media/gallery/job-02-after.jpg' },
  { id: 'job-03', category: 'siding', title: 'Hail-pocked siding, full elevation', city: 'Yukon, OK', scope: 'Fiber-cement · Trim & soffit · Color match', before: '/media/gallery/job-03-before.jpg', after: '/media/gallery/job-03-after.jpg' },
  { id: 'job-04', category: 'roofing', title: 'Denied claim, overturned & replaced', city: 'Choctaw, OK', scope: 'Re-inspection · Claim supplement · Full replacement', before: '/media/gallery/job-04-before.jpg', after: '/media/gallery/job-04-after.jpg', video: '/media/gallery/job-04-drone.mp4' },
  { id: 'job-05', category: 'gutters', title: 'Seamless gutters + drainage redesign', city: 'Nichols Hills, OK', scope: '6" seamless · Leaf guards · Downspout reroute', before: '/media/gallery/job-05-before.jpg', after: '/media/gallery/job-05-after.jpg' },
  { id: 'job-06', category: 'roofing', title: 'Steep-pitch replacement, two crews', city: 'Norman, OK', scope: 'Tear-off · Synthetic underlayment · Ice & water', before: '/media/gallery/job-06-before.jpg', after: '/media/gallery/job-06-after.jpg' },
  { id: 'job-07', category: 'siding', title: 'Storm-damaged vinyl, whole-home refresh', city: 'Midwest City, OK', scope: 'Vinyl siding · Fascia wrap · Insurance claim', before: '/media/gallery/job-07-before.jpg', after: '/media/gallery/job-07-after.jpg' },
  { id: 'job-08', category: 'gutters', title: 'Foundation pooling fixed for good', city: 'Bethany, OK', scope: 'Re-pitch · Oversized downspouts · Splash control', before: '/media/gallery/job-08-before.jpg', after: '/media/gallery/job-08-after.jpg' },
];

/** Oklahoma-specific insurance facts — the highest-value trust content on the claims page. */
export const okFacts = [
  {
    title: 'The 12-month window',
    body: 'Most Oklahoma policies require storm-damage claims to be filed within 12 months of the date of loss. If a storm hit in the past year — even if you only just noticed the damage — you may still have a valid claim.',
  },
  {
    title: 'RCV vs. ACV',
    body: 'Replacement Cost Value pays what it costs to replace your roof today. Actual Cash Value subtracts depreciation and can leave you thousands short. We read your policy first and document the claim to recover everything it owes you.',
  },
  {
    title: 'Class 4 shingles',
    body: 'Impact-rated Class 4 shingles survive Oklahoma hail dramatically better — and many insurers discount premiums for installing them. We\u2019ll tell you straight whether the upgrade pays for itself on your policy.',
  },
];

export const claimStory = {
  stages: ['Denied', 'Re-inspected', 'Corrected', 'Approved'],
  location: 'Choctaw, OK',
  headline: 'The claim their insurer called \u201cwear and tear.\u201d',
  body: 'A homeowner in Choctaw called us after their carrier denied the whole roof. The adjuster\u2019s report said weathering — no storm damage. We put a ladder up, documented 40+ hail strikes with chalk and photos, matched them to the county storm date, and requested a re-inspection with our foreman on the roof. The carrier corrected the report and approved a full replacement.',
  result: 'Full replacement approved — homeowner paid only their deductible.',
};

export const insuranceFaqs = [
  { q: 'Will filing a claim raise my rates?', a: 'In Oklahoma, insurers generally can\u2019t single you out for a rate increase because of a weather-related claim — storm losses are treated as acts of nature, and rate changes apply region-wide. That\u2019s exactly why we inspect before you file: if the damage isn\u2019t worth a claim, we\u2019ll tell you.' },
  { q: 'Can you cover or waive my deductible?', a: 'No — and you should hang up on any roofer who offers to. Waiving deductibles is illegal in Oklahoma and puts the homeowner at risk. We keep every claim clean and by the book.' },
  { q: 'How long does the whole process take?', a: 'Inspection to approved claim is typically 1–3 weeks depending on your carrier. Once approved, most residential installs are finished in a single day.' },
  { q: 'What if my claim is already denied?', a: 'Denials get overturned more often than people think — usually because damage was under-documented the first time. We re-inspect, build the evidence, and request a re-inspection with your carrier. It costs you nothing to have us look.' },
  { q: 'Do I have to use a contractor my insurer suggests?', a: 'No. In Oklahoma you have the legal right to choose your own contractor. Carrier-preferred programs work for the carrier; we work for you.' },
];
