# Ringco Roofing — Website

Premium marketing site for Ringco Roofing and Construction (Oklahoma County, OK).

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS · Framer Motion · Firebase (Firestore + Auth) · Cloudinary · Resend · Vercel

---

## Pages
- `/` — Home: hero video, services, claim process, animated stats, before/after slider, reviews, CTAs
- `/services` — Service detail sections + FAQ
- `/insurance-claims` — Dedicated conversion page (the key differentiator vs. competitors)
- `/gallery` — Cloudinary-driven project gallery, filterable, lightbox (ISR, revalidates every 60s)
- `/about` — Family-owned story + certifications
- `/contact` — 3-step lead form → Firestore + email
- `/admin` — Auth-protected photo uploader (Cloudinary widget → Firestore metadata)

---

## 1. Install
```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

## 2. Firebase
1. Create a Firebase project → enable **Firestore** and **Authentication** (Email/Password).
2. Add one admin user under Authentication → Users (this is who logs into `/admin`).
3. Web app config → fill the `NEXT_PUBLIC_FIREBASE_*` vars.
4. Service account (Project Settings → Service accounts → Generate key) → fill the three `FIREBASE_ADMIN_*` vars. Paste the private key with literal `\n` newlines, wrapped in quotes.
5. Deploy the security rules in `firestore.rules` (Firestore → Rules → paste → Publish).

Collections are created automatically on first write: `leads`, `gallery`.

## 3. Cloudinary
1. Create a Cloudinary account → note your **cloud name**.
2. Settings → Upload → add an **unsigned** upload preset named `ringco_gallery` (folder `ringco/gallery`).
3. Fill `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, and the API key/secret.

## 4. Email notifications (Resend)
1. Create a Resend account, verify the sending domain, create an API key.
2. Fill `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`.
   (If you skip this, leads still save to Firestore — only the email alert is skipped.)

## 5. Deploy (Vercel)
1. Push to GitHub.
2. Import the repo in Vercel.
3. Add every variable from `.env.example` under Project → Settings → Environment Variables.
4. Deploy. Point the domain at Vercel, and it issues SSL automatically.

---

## How the client uses it
- **See leads:** Firebase Console → Firestore → `leads` collection (newest first). Each lead also arrives by email.
- **Upload project photos:** go to `/admin`, sign in, add a title + category, click **Upload photo**. New photos appear on `/gallery` within a minute.

## Notes
- Swap the hero video `src` in `src/components/Hero.tsx` for Ringco's own footage.
- Replace the Unsplash placeholder images in `src/lib/content.ts` and the service/about pages with real Ringco photography.
- The lead form uses a honeypot + server-side validation; the admin panel is gated by Firebase Auth.
