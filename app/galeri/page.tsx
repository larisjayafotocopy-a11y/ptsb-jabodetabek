import { supabase } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GaleriPage() {
  const { data: albums } = await supabase
    .from('galeri_album')
    .select('id, judul, deskripsi, foto_sampul, created_at, korwil:korwil_id(nama_wilayah)')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section - sama gaya seperti Direktori & Berita */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Galeri Foto</h1>
          <p className="text-gray-600 text-base">Dokumentasi kegiatan dari seluruh wilayah PTSB Jabodetabek.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(albums || []).map((a: any) => (
            <Link
              key={a.id}
              href={`/galeri/${a.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              {a.foto_sampul && (
                /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(a.foto_sampul) ? (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-white text-4xl">
                    ▶️
                  </div>
                ) : (
                  <img
                    src={a.foto_sampul}
                    alt={a.judul}
                    className="w-full h-48 object-cover group-hover:scale-105 transition"
                  />
                )
              )}
              <div className="p-5">
                <p className="text-[10px] font-bold text-batakRed uppercase mb-1">
                  {a.korwil?.nama_wilayah || 'Admin Pusat'}
                </p>
                <h3 className="font-bold text-gray-900">{a.judul}</h3>
                {a.deskripsi && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.deskripsi}</p>}
              </div>
            </Link>
          ))}
          {(!albums || albums.length === 0) && (
            <p className="col-span-full text-center text-gray-400 py-10">Belum ada album.</p>
          )}
        </div>
      </div>
    </main>
  );
}
