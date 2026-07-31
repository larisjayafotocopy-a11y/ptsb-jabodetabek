import { supabase } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GaleriAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ data: album }, { data: fotoList }] = await Promise.all([
    supabase.from('galeri_album').select('*, korwil:korwil_id(nama_wilayah)').eq('id', id).single(),
    supabase.from('galeri_foto').select('id, foto_url, tipe').eq('album_id', id).order('urutan'),
  ]);

  if (!album) notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/galeri" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali
        </Link>

        <div className="mb-8">
          <p className="text-xs font-bold text-batakRed uppercase mb-1">
            {album.korwil?.nama_wilayah || 'Admin Pusat'}
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">{album.judul}</h1>
          {album.deskripsi && <p className="text-gray-500 mt-2">{album.deskripsi}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(fotoList || []).map((f) =>
            f.tipe === 'video' ? (
              <video
                key={f.id}
                src={f.foto_url}
                controls
                className="w-full h-40 object-cover rounded-xl border border-gray-100 bg-black"
              />
            ) : (
              <img
                key={f.id}
                src={f.foto_url}
                className="w-full h-40 object-cover rounded-xl border border-gray-100"
                alt=""
              />
            )
          )}
          {(!fotoList || fotoList.length === 0) && (
            <p className="col-span-full text-center text-gray-400 py-10">Belum ada foto.</p>
          )}
        </div>
      </div>
    </main>
  );
}
