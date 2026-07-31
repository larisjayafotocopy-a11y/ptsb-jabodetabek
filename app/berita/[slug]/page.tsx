import { supabase } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: b } = await supabase
    .from('berita')
    .select('*, korwil:korwil_id(nama_wilayah)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!b) notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/berita" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {b.foto_sampul && <img src={b.foto_sampul} alt={b.judul} className="w-full h-64 object-cover" />}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-batakRed">{b.kategori}</span>
              <span className="text-[10px] text-gray-400">
                {new Date(b.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{b.judul}</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase mb-6">
              Diposting oleh {b.korwil?.nama_wilayah || 'Admin Pusat'}
            </p>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: b.konten }} />
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
