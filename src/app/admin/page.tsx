import AdminUploader from '@/components/AdminUploader';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Admin | Ringco Roofing', robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <section className="px-[6vw] pb-24 pt-36">
      <div className="mx-auto max-w-wrap"><AdminUploader /></div>
    </section>
  );
}
