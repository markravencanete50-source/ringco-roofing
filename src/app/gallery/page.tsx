import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import GalleryGrid, { type GalleryItem } from '@/components/GalleryGrid';
import CtaBand from '@/components/CtaBand';
import { getAdminDb } from '@/lib/firebaseAdmin';

export const metadata: Metadata = {
  title: 'Project Gallery | Ringco Roofing — Recent Work in Oklahoma County',
  description: 'Browse recent roofing, siding, gutter and storm-damage projects completed by Ringco Roofing across Oklahoma County, OK.',
  alternates: { canonical: '/gallery' },
};

// Revalidate so new admin uploads appear without a redeploy.
export const revalidate = 60;

async function getItems(): Promise<GalleryItem[]> {
  try {
    const snap = await getAdminDb().collection('gallery').orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, publicId: data.publicId, title: data.title ?? '', category: data.category ?? 'Roofing' };
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getItems();
  return (
    <>
      <PageHeader eyebrow="Our work" title="Roofs we've put our name on." sub="Real projects across Oklahoma County — documented before, during, and after. Filter by the work you're considering." />
      <section className="px-[6vw] py-20">
        <div className="mx-auto max-w-wrap"><GalleryGrid items={items} /></div>
      </section>
      <CtaBand />
    </>
  );
}
