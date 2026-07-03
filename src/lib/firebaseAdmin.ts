// Server-side Firebase Admin — used in API routes / server components only.
// Lazily initialized so builds without env vars (and static analysis) don't crash.
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cached: Firestore | null = null;

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export function getAdminDb(): Firestore {
  if (cached) return cached;
  cached = getFirestore(getAdminApp());
  return cached;
}
