import { supabase } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const KATEGORI_ICON: Record<string, string> = {
  Siriaon: '🎉',
  Sitaonon: '🕯️',
  Pengumuman: '📢',
  Kegiatan: '🎪',
};

export default async function BeritaPage() {
  const { data: list } = await supabase
    .from('berita')
    .select('id, judul, slug, kategori, foto_sampul, created_at, korwil:korwil_id(nama_wilayah)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section - Mengikuti lebar Navbar (max-w-7xl), sama seperti Direktori */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Warta PTSB</h1>
          <p className="text-gray-600 text-base">Kabar terbaru dari seluruh wilayah PTSB Jabodetabek.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 gap-6">
          {(list || []).map((b: any) => (
            <Link
              key={b.id}
              href={`/berita/${b.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row"
            >
              {b.foto_sampul && (
                <img src={b.foto_sampul} alt={b.judul} className="w-full sm:w-48 h-40 object-cover" />
              )}
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-batakRed">
                    {KATEGORI_ICON[b.kategori] || '📰'} {b.kategori}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(b.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 text-lg leading-snug">{b.judul}</h2>
                <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase">
                  {b.korwil?.nama_wilayah || 'Admin Pusat'}
                </p>
              </div>
            </Link>
          ))}
          {(!list || list.length === 0) && (
            <p className="text-center text-gray-400 py-10">Belum ada berita.</p>
          )}
        </div>
      </div>
    </main>
  );
}
