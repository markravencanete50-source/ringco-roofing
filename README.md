# Ringco Roofing & Construction — Website

Next.js 14 (App Router) + Tailwind CSS + TypeScript implementation of the Ringco marketing site.
Design reference: `Ringco Homepage 2026.dc.html` (open in a browser to see the target design — it is git-ignored and not part of the app).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also runs lint + type-check)
```

## Architecture

Content-driven, page-per-topic structure (each page owns unique copy + schema — no
duplicated paragraphs across pages, which is a real SEO liability for competitors).

- `src/app/` — routes:
  - `/` — homepage (hero → path router → differentiators → services → case study → gallery → trust → reviews → CTA)
  - `/services` — hub that routes to the three service pages
  - `/roofing` — repair-vs-replacement decision block, materials, FAQ
  - `/siding`, `/gutters` — dedicated service pages
  - `/insurance-claims` — process stepper, Oklahoma-specific claims education, featured case study, compliance-safe FAQ
  - `/about` — family-legacy story, in-house-crew claim, named team
  - `/gallery` — filterable before/after gallery + full review feed
  - `/contact` — multi-modal CTA + lead form with a storm/insurance qualifying question
  - `/api/lead` — lead intake endpoint (**stub** — see below)
  - `sitemap.ts`, `robots.ts`, `not-found.tsx`
- `src/lib/content.ts` — **ALL copy**, nav, services, reviews, FAQs, case study, team,
  service areas, Oklahoma claim facts, contact info. Edit content here, not in components.
- `src/components/` — shared primitives:
  - `Tel` — the ONE canonical phone link (kills the phone-mismatch bug at the source; used everywhere)
  - `JsonLd` — per-page structured data; `Faq` also emits FAQPage schema from its data
  - `Section`, `SectionHead`, `MultiCta`, `PathRouter`, `DifferentiatorBand`, `CaseStudy`,
    `CrossLink`, `ServiceAreas`, `Gallery`, `ReviewsGrid`, `LeadForm`, `BeforeAfter`
  - plus `Header`, `Footer`, `Button`, `PageHeader`, `Reveal`, `StickyMobileCta`, `Hero`, `Services`, `Marquee`, `Stats`, `Certifications`, `Reviews`
- `tailwind.config.ts` + `src/app/globals.css` — design tokens (oklch color vars, Space Grotesk / Manrope fonts, wrap width)

## SEO

- Per-page `<title>`/description + canonical, and per-page schema type: `RoofingContractor`
  (LocalBusiness) on Home + Contact only, `Service` on service pages, `FAQPage` on FAQ
  sections, `Organization` on About. Not repeated site-wide.
- Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) for canonical + sitemap URLs.

## The lead form / API

`src/app/api/lead/route.ts` validates the submission (name + phone required), drops
honeypot spam, and returns success — but does **not yet deliver the lead anywhere**. It
logs server-side so nothing is lost while testing. To go live, wire ONE delivery path
(email via Resend/SendGrid, a Make.com/Zapier webhook, or a DB) and add its secret in
Vercel. No secrets are committed.

## TODO before launch (content verification)

- [ ] Confirm the Ring-family history dates + Brantlon Ring tenure (`content.ts → site.legacyNote`)
- [ ] Replace the featured case study specifics with a REAL, client-approved outcome —
      do not publish invented figures (`content.ts → caseStudy`, marked with TODOs)
- [ ] Confirm team names/roles and add real photos (`content.ts → team`, `/about`)
- [ ] Replace Unsplash placeholders with real job-site photography (`content.ts` image URLs)
- [ ] Real logo asset in Header/Footer
- [ ] Wire `/api/lead` to email/CRM (see above)
- [ ] Verify license/cert claims (GAF, BBB, 15-yr warranty) with the client
