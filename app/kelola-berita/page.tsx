'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Berita {
  id: number;
  judul: string;
  kategori: string;
  status: string;
  created_at: string;
  korwil: { nama_wilayah: string } | null;
}

export default function KelolaBeritaPage() {
  const supabase = createClient();
  const [list, setList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from('berita')
      .select('id, judul, kategori, status, created_at, korwil:korwil_id(nama_wilayah)')
      .order('created_at', { ascending: false });
    setList((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus berita ini?')) return;
    const { error } = await supabase.from('berita').delete().eq('id', id);
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
          <h1 className="text-3xl font-black text-gray-900">Kelola Berita & Ulaon</h1>
          <Link
            href="/kelola-berita/baru"
            className="bg-batakRed text-white px-5 py-3 rounded-xl font-bold hover:bg-batakDark transition"
          >
            + Tulis Berita
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-10">Memuat...</p>
        ) : (
          <div className="space-y-3">
            {list.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center gap-4 flex-wrap"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {b.status === 'published' ? 'Terbit' : 'Draft'}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {b.korwil?.nama_wilayah || 'Admin Pusat'}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900">{b.judul}</p>
                </div>
                <div className="flex gap-4">
                  <Link href={`/kelola-berita/${b.id}`} className="text-sm font-bold text-blue-700">
                    Ubah
                  </Link>
                  <button onClick={() => handleDelete(b.id)} className="text-sm font-bold text-red-700">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {list.length === 0 && <p className="text-center text-gray-400 py-10">Belum ada berita.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
