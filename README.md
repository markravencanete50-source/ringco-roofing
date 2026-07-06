# Ringco Roofing and Construction — Website

Marketing site for **Ringco Roofing and Construction** (Oklahoma City / Oklahoma County, OK).
Design direction **1b "Gradient Bento"** — glass nav over a full-bleed video hero, a bento
service grid, brand-gradient accents, and scroll-driven motion throughout.

This is a **static site** (plain HTML / CSS / JS, no build step). It deploys directly on Vercel.

## Pages
| URL | File | Purpose |
|-----|------|---------|
| `/` | `index.html` | Home — hero, stats, services bento, claims band, before/after, CTA |
| `/services` | `services.html` | Roofing · Siding · Gutters · Storm (anchors `#roofing #siding #gutters #storm`) |
| `/insurance-claims` | `insurance-claims.html` | Claims process, bento steps, FAQ |
| `/gallery` | `gallery.html` | Filterable project gallery |
| `/about` | `about.html` | Story, values, count-up stats |
| `/contact` | `contact.html` | Estimate form + contact card |

## Structure
```
index.html + 5 pages   Page markup
css/style.css          Full design system (brand tokens, components, motion, responsive)
js/main.js             All interactions + the motion-enhancement layer
assets/                Brand logos (transparent PNGs — never retype the wordmark)
media/                 Photos & video (real Ringco footage — do not swap without sign-off)
vercel.json            cleanUrls, long-cache for /media, security headers
robots.txt / sitemap.xml
```

## Brand (from the RINGCO Brand Bible)
- **Colors** — deep blue `#024778`, mid `#005C97`, navy `#092849`, `#0E3C5E`, deepest `#000B17`;
  brand gradient `linear-gradient(100deg,#024778,#005C97)`. Shadows are always navy-tinted, never gray/black.
- **Type** — headlines **Plus Jakarta Sans** (free stand-in for the commercial *Neue Plak*);
  body **Mulish** (an actual brand font). If Neue Plak is licensed, swap `--font-head` in `css/style.css`.
- **Logo** — `assets/ringco-logo-landscape.png` (light backgrounds), `assets/ringco-logo.png` (square/favicon).

## Motion & UX
IntersectionObserver reveals & staggers, hero headline word-rise, count-up stats, infinite trust
marquee, sticky glass header, full-screen mobile nav, FAQ accordion, gallery filters, and an
enhancement layer: **scroll-progress bar, drifting aurora glow on dark sections, magnetic primary
CTAs, subtle 3D card tilt, a cinematic hero grade, and a keyboard-accessible before/after slider.**
Every ambient/pointer effect is gated behind `prefers-reduced-motion` **and** `(pointer:fine)`.

## Local preview
No dependencies. From the repo root:
```
node .claude/serve.cjs      # → http://localhost:3000 (mirrors Vercel clean URLs)
```

## Production TODO
- **Contact form** (`#estimate-form`) is a front-end stub — wire it to an email service / CRM
  webhook before launch. Keep this repo public? Then keep any keys server-side, never committed.
- Confirm client-verification content: team names/roles, area-city list, GAF/BBB/warranty claims.

## History
The previous Firebase and Next.js builds remain recoverable in git history (pre-redesign HEAD
`f95990d`; earlier Firebase build at `40598e1`).
