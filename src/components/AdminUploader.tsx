'use client';
import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { clsx } from './clsx';

const CATEGORIES = ['Roofing', 'Siding', 'Gutters', 'Storm'];

// Cloudinary upload widget global (loaded via <Script>)
declare global {
  interface Window { cloudinary?: any }
}

type Row = { id: string; publicId: string; title: string; category: string };

export default function AdminUploader() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authErr, setAuthErr] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Roofing');
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); }), []);

  const load = useCallback(async () => {
    const snap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')));
    setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, 'id'>) })));
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  async function login() {
    setAuthErr('');
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setAuthErr('Wrong email or password.'); }
  }

  function openWidget() {
    if (!window.cloudinary) return;
    if (!title.trim()) { setMsg('Add a title first.'); return; }
    setMsg('');
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: 'ringco/gallery',
        sources: ['local', 'camera', 'url'],
        multiple: false,
        maxFileSize: 10_000_000,
      },
      async (error: unknown, result: any) => {
        if (!error && result?.event === 'success') {
          await addDoc(collection(db, 'gallery'), {
            publicId: result.info.public_id,
            title: title.trim(),
            category,
            createdAt: serverTimestamp(),
          });
          setTitle('');
          setMsg('Uploaded. It will appear on the gallery within a minute.');
          load();
        }
      },
    );
    widget.open();
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, 'gallery', id));
    load();
  }

  if (!ready) return <div className="py-20 text-center text-muted">Loading…</div>;

  if (!user)
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-line bg-card p-8 shadow-[0_30px_60px_-40px_oklch(0.2_0.02_60/0.4)]">
        <h1 className="mb-1 font-display text-[24px] font-bold">Admin sign in</h1>
        <p className="mb-6 text-[14px] text-muted">Upload and manage project photos.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-3 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} type="password" placeholder="Password" className="mb-4 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" />
        {authErr && <p className="mb-3 text-[14px] font-semibold text-[oklch(0.55_0.2_25)]">{authErr}</p>}
        <button onClick={login} className="w-full rounded-full bg-accent py-3.5 font-display font-bold text-accent-ink hover:bg-accent-hi">Sign in</button>
      </div>
    );

  return (
    <div>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-bold">Photo manager</h1>
          <p className="text-[14px] text-muted">Signed in as {user.email}</p>
        </div>
        <button onClick={() => signOut(auth)} className="rounded-full border border-line px-5 py-2.5 font-display text-[14px] font-bold text-muted hover:text-ink">Sign out</button>
      </div>

      <div className="mb-10 grid gap-4 rounded-3xl border border-line bg-card p-6 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div>
          <label className="mb-2 block font-display text-[14px] font-bold">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full roof replacement — Edmond" className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" />
        </div>
        <div>
          <label className="mb-2 block font-display text-[14px] font-bold">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-line px-4 py-3 outline-none focus:border-accent">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openWidget} className="rounded-full bg-accent px-7 py-3.5 font-display font-bold text-accent-ink hover:bg-accent-hi">Upload photo</button>
      </div>
      {msg && <p className="mb-6 text-[14px] font-semibold text-accent-deep">{msg}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((r) => (
          <div key={r.id} className="overflow-hidden rounded-2xl border border-line bg-card">
            <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,f_auto,q_auto/${r.publicId}`} alt={r.title} className="aspect-[4/3] w-full object-cover" />
            <div className="p-3">
              <div className="truncate font-display text-[13px] font-bold">{r.title}</div>
              <div className="mb-2 text-[12px] text-muted">{r.category}</div>
              <button onClick={() => remove(r.id)} className={clsx('text-[12px] font-semibold text-[oklch(0.55_0.2_25)]')}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
