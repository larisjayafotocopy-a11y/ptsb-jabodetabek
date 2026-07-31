'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Album {
  id: number;
  judul: string;
  foto_sampul: string | null;
  created_at: string;
  korwil: { nama_wilayah: string } | null;
}

export default function KelolaGaleriPage() {
  const supabase = createClient();
  const [list, setList] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from('galeri_album')
      .select('id, judul, foto_sampul, created_at, korwil:korwil_id(nama_wilayah)')
      .order('created_at', { ascending: false });
    setList((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus album ini beserta semua fotonya?')) return;
    const { error } = await supabase.from('galeri_album').delete().eq('id', id);
    if (error) {
      alert('Gagal hapus: ' + error.message);
      return;
    }
    load();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali ke Dashboard
        </Link>
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-black text-gray-900">Kelola Galeri</h1>
          <Link
            href="/kelola-galeri/baru"
            className="bg-batakRed text-white px-5 py-3 rounded-xl font-bold hover:bg-batakDark transition"
          >
            + Album Baru
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-10">Memuat...</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {list.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {a.foto_sampul && <img src={a.foto_sampul} className="w-full h-32 object-cover" alt="" />}
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {a.korwil?.nama_wilayah || 'Admin Pusat'}
                  </p>
                  <p className="font-bold text-gray-900">{a.judul}</p>
                  <button onClick={() => handleDelete(a.id)} className="text-sm font-bold text-red-700 mt-2">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <p className="col-span-2 text-center text-gray-400 py-10">Belum ada album.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
