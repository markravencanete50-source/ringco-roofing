// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for all site copy, contact info, nav, and structured
// content. Edit copy HERE, not in components/pages. Keeping strings in this .ts
// file (not JSX) also avoids React's no-unescaped-entities lint rule.
//
// TODO (client verification before launch):
//  - Confirm the Ring-family history dates and Brantlon Ring tenure.
//  - Confirm team member names/roles and supply photos.
//  - Replace the case-study specifics (marked below) with a real, approved
//    claim outcome. Do NOT publish invented figures.
//  - Verify GAF / BBB / warranty claims.
//  - Replace Unsplash placeholder imagery with real job-site photography.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Ringco Roofing and Construction',
  short: 'Ringco',
  phone: '+1-405-470-7696',
  phoneDisplay: '(405) 470-7696',
  textReady: true, // same line accepts SMS
  email: 'brantlon@ringcoconstruction.com',
  owner: 'Brantlon Ring',
  area: 'Oklahoma County, OK',
  areaShort: 'Oklahoma County',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ringcoroofing.com',
  facebook: 'https://facebook.com/138247566963256',
  hours: 'Mon–Sat, 7am–7pm · 24/7 storm emergency line',
  // A defensible framing of the family legacy — verify specifics with client.
  legacyNote: 'Roofing has been in the Ring family for decades, and Brantlon Ring has led Ringco locally for over ten years.',
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Insurance Claims', href: '/insurance-claims' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// The one claim no competitor in the OKC metro leads with (see research).
export const differentiators = [
  {
    title: 'Our own crew — never subcontractors',
    body: 'The people on your roof are Ringco employees, accountable to us and to you. No handoffs, no strangers, no finger-pointing when it matters.',
  },
  {
    title: 'Family-owned and still local',
    body: site.legacyNote + ' We answer for our work long after the crew leaves, and we intend to be here when your warranty needs us.',
  },
  {
    title: 'Straight talk on your claim',
    body: 'We document what the storm actually did and stand by it — assertively and within the law. No inflated invoices, no deductible games.',
  },
];

// -------- Services (summary cards used on home + hub) ----------------------
export const services = [
  {
    slug: 'roofing',
    href: '/roofing',
    tag: 'Roofing',
    title: 'Roof Replacement & Repair',
    blurb:
      'GAF-certified installs built to survive Oklahoma hail and wind — from targeted repairs to full tear-offs, backed by a 15-year labor warranty.',
    image:
      'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'siding',
    href: '/siding',
    tag: 'Siding',
    title: 'Siding Installation & Repair',
    blurb:
      'Impact-resistant siding that protects the envelope and lifts curb appeal — weather-tight installs with clean lines and a long lifespan.',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'gutters',
    href: '/gutters',
    tag: 'Gutters',
    title: 'Seamless Gutters & Guards',
    blurb:
      'Custom seamless gutters and leaf guards that move water away from your foundation — engineered for Oklahoma downpours.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'insurance-claims',
    href: '/insurance-claims',
    tag: 'Storm & Claims',
    title: 'Storm Damage & Insurance Claims',
    blurb:
      'We inspect before you file, meet your adjuster on the roof, and manage the claim end-to-end — so you get the roof you are owed.',
    image:
      'https://images.unsplash.com/photo-1523867904486-2cd4d5b13d40?auto=format&fit=crop&w=1200&q=80',
  },
];

// -------- Homepage "pick your path" router ---------------------------------
export const paths = [
  {
    kicker: 'Storm or hail damage',
    title: 'I think the storm damaged my roof',
    body: 'Fastest route to a free inspection and, if it is warranted, a fully managed insurance claim.',
    href: '/insurance-claims',
    cta: 'Start an insurance claim',
    tone: 'accent' as const,
  },
  {
    kicker: 'Roofing project',
    title: 'I need a roof repair or replacement',
    body: 'Not storm-related? See how repair vs. replacement works, materials, and our 15-year labor warranty.',
    href: '/roofing',
    cta: 'Explore roofing',
    tone: 'panel' as const,
  },
  {
    kicker: 'Siding & gutters',
    title: 'I need siding or gutters',
    body: 'Protect and finish the rest of the exterior with the same crew that does your roof.',
    href: '/services',
    cta: 'Siding & gutters',
    tone: 'panel' as const,
  },
];

export const steps = [
  { n: '01', title: 'Free inspection', body: 'We assess your roof, document every point of damage, and give you a straight answer — no pressure, no upsell.' },
  { n: '02', title: 'We meet your adjuster', body: 'We stand on the roof with your insurance adjuster so legitimate storm damage gets documented, not missed or denied.' },
  { n: '03', title: 'Approval & scheduling', body: 'Once the claim is approved, we schedule around your life and order premium materials up front.' },
  { n: '04', title: 'Install & warranty', body: 'A clean, fast install by our own crews — finished with a 15-year labor warranty and a spotless site.' },
];

export const stats = [
  { v: '15', suffix: 'yr', label: 'Labor warranty' },
  { v: '1,200', suffix: '+', label: 'Roofs completed' },
  { v: '24/7', suffix: '', label: 'Emergency response' },
  { v: '100', suffix: '%', label: 'Family owned' },
];

// -------- Reviews (rendered, not an empty widget) --------------------------
export const reviews = [
  { quote: 'Ringco caught hail damage two other companies missed, met our adjuster, and had a new roof on in a day. The claim was fully approved.', name: 'Danielle R.', role: 'Edmond, OK', service: 'Insurance', rating: 5 },
  { quote: 'Straightforward, no games. They told me what I actually needed and the crew left the yard cleaner than they found it.', name: 'Marcus T.', role: 'Oklahoma City, OK', service: 'Roofing', rating: 5 },
  { quote: 'From the free inspection to the final walkthrough, it felt like dealing with family. The 15-year warranty sealed it.', name: 'Priya S.', role: 'Moore, OK', service: 'Roofing', rating: 5 },
  { quote: 'Blake, Brantlon and Victor were upfront the whole way. New gutters and siding after the storm, done right the first time.', name: 'Karen W.', role: 'Midwest City, OK', service: 'Siding', rating: 5 },
  { quote: 'Our first claim came back low. Ringco supplemented it with real documentation and the insurer approved the full replacement.', name: 'Anthony G.', role: 'Del City, OK', service: 'Insurance', rating: 5 },
];

// -------- Featured case study ----------------------------------------------
// NOTE: Structure follows McRoof's strong named-case-study pattern. The copy
// below is written to be honest and non-fabricated. Before launch, replace the
// bracketed specifics with a REAL, client-approved outcome. Do not invent a
// dollar figure for a live site.
export const caseStudy = {
  kicker: 'Featured claim',
  title: 'A denied claim, documented and overturned',
  homeowner: 'Homeowner in Oklahoma County', // TODO: real (approved) first name + city
  insurer: 'a major national insurer', // TODO: name only if the client is comfortable and it is accurate
  summary:
    'After a spring hail storm, the initial inspection came back with damage marked as cosmetic and the claim underpaid. We re-inspected, documented the full extent of the impact damage, and met the adjuster on the roof to walk through every hit.',
  outcome:
    'The scope was corrected and a full roof replacement was approved. The homeowner paid their deductible — nothing more — and had a new GAF-certified roof, installed by our own crew, within the week.',
  // TODO: add a verified metric here, e.g. "$X,XXX added to the approved scope"
  metricLabel: 'Result',
  metricValue: 'Full replacement approved',
};

// -------- Oklahoma-specific claims education (Arrowhead's strength, on-page) -
export const okClaimFacts = [
  {
    term: '12-month filing window',
    body: 'Oklahoma policies generally require you to file a storm-damage claim within one year of the date of loss. Miss it and a valid claim can be denied outright — so an early free inspection matters.',
  },
  {
    term: 'RCV vs. ACV',
    body: 'Replacement Cost Value pays what it costs to replace the roof today; Actual Cash Value subtracts depreciation. Knowing which your policy pays — and how recoverable depreciation is released — changes your out-of-pocket cost.',
  },
  {
    term: 'Impact-resistant shingles',
    body: 'Class 4 impact-resistant shingles can qualify for an insurance premium discount in Oklahoma. We can quote them as an upgrade during a replacement.',
  },
];

// -------- FAQs (per topic; each list also feeds FAQPage schema) ------------
export const faqs = {
  insurance: [
    { q: 'Will filing a claim raise my premium?', a: 'A single weather-related claim is treated differently than an at-fault claim, but it is your decision. That is exactly why we inspect first and tell you honestly whether the damage is worth filing before you ever call your insurer.' },
    { q: 'How long does a roof claim take?', a: 'Most straightforward hail or wind claims move from inspection to approved scope in a couple of weeks, then to installation quickly after. Supplements or disputed scope can add time — we manage that back-and-forth for you.' },
    { q: 'Do you charge extra to file supplements?', a: 'We document and submit supplements as part of managing your claim. We follow Oklahoma law on all billing and never structure anything around waiving or absorbing your deductible.' },
    { q: 'What if my claim was already denied or underpaid?', a: 'Bring us the paperwork. A denial is not always the end — with proper documentation and an on-roof adjuster meeting, underpaid and denied claims are often corrected.' },
  ],
  roofing: [
    { q: 'How do I know if I need a repair or a full replacement?', a: 'A few missing shingles or an isolated leak is usually a repair. Widespread granule loss, aging past 15–20 years, or storm damage across multiple slopes points to replacement. Our free inspection gives you a straight answer either way.' },
    { q: 'How long does a roof replacement take?', a: 'Most residential replacements are completed in a single day. Larger or more complex roofs may take two.' },
    { q: 'What shingle brands do you install?', a: 'We are a factory-certified GAF installer and can also quote Class 4 impact-resistant options that may lower your insurance premium.' },
    { q: 'Do you offer financing?', a: 'Talk to us about your project — we will walk you through the payment options available so cost is not the reason a failing roof waits.' },
  ],
  siding: [
    { q: 'What siding materials do you install?', a: 'We install and repair vinyl and fiber-cement siding, color-matched to your home and installed weather-tight by our own crew.' },
    { q: 'Can siding damage go on my storm claim?', a: 'Often, yes. Hail and wind frequently damage siding and gutters along with the roof, and we can document all of it on one inspection.' },
  ],
  gutters: [
    { q: 'Are your gutters seamless?', a: 'Yes. We form seamless gutters on-site to fit your roofline, which means fewer joints and far fewer leaks over time.' },
    { q: 'Do you install gutter guards?', a: 'We do — leaf guards keep debris out and water moving, which protects both your gutters and your foundation.' },
  ],
};

export const certs = [
  { badge: 'GAF', kind: 'gaf', title: 'GAF Certified', body: 'Factory-certified installer held to GAF quality and warranty standards.' },
  { badge: 'A+', kind: 'bbb', title: 'BBB Accredited', body: 'Accredited business with a track record of resolved, satisfied customers.' },
  { badge: '15', kind: 'gaf', title: '15-Year Warranty', body: 'Industry-leading labor warranty on every full roof replacement.' },
];

// -------- Team (About page) — names surfaced positively in real reviews ----
// TODO: confirm roles and add photos before launch.
export const team = [
  { name: 'Brantlon Ring', role: 'Owner', initials: 'BR' },
  { name: 'Blake', role: 'Project Lead', initials: 'BL' },
  { name: 'Victor', role: 'Crew Lead', initials: 'VC' },
];

// -------- Service area (NAP + LocalBusiness areaServed) ---------------------
export const serviceAreas = [
  'Oklahoma City', 'Edmond', 'Midwest City', 'Del City', 'Bethany',
  'Warr Acres', 'The Village', 'Nichols Hills', 'Choctaw', 'Harrah',
  'Jones', 'Nicoma Park', 'Spencer', 'Forest Park', 'Moore',
];

// -------- Gallery projects (real captions build credibility) ----------------
// TODO: replace images + captions with real, dated project photography.
export const projects = [
  { service: 'Roofing', before: 'https://images.unsplash.com/photo-1595872018818-97555653a011?auto=format&fit=crop&w=1400&q=80', after: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1400&q=80', caption: 'Hail-damage replacement — Edmond, spring 2025' },
  { service: 'Roofing', before: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd0?auto=format&fit=crop&w=1400&q=80', after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', caption: 'Full tear-off & GAF re-roof — Oklahoma City' },
  { service: 'Siding', before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80', after: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80', caption: 'Storm-damaged siding replacement — Midwest City' },
  { service: 'Gutters', before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80', after: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80', caption: 'Seamless gutter install — Del City' },
];
