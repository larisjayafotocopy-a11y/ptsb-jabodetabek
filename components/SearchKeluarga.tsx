"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function SearchKeluarga({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [selectedMarga, setSelectedMarga] = useState<string | null>(null); // Awalnya null agar kosong

  // 1. Perbaikan Statistik (Gunakan .trim() agar spasi tidak merusak hitungan)
  const stats = initialData.reduce((acc, curr) => {
    const m = (curr.marga || 'Lainnya').trim();
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mOrder = ['Sihite Pande Raja', 'Sihite Guru Tohuk', 'Sihite Siguru Leang'];

  // 2. Logika Filter
  const filtered = initialData.filter(k => {
    const m = (k.marga || 'Lainnya').trim();
    const matchMarga = selectedMarga === 'Semua' || m === selectedMarga;
    const matchNama = k.nama_kepala.toLowerCase().includes(query.toLowerCase());
    return matchMarga && matchNama;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Dashboard Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...mOrder, 'Semua'].map((m) => (
          <button
            key={m}
            onClick={() => { setSelectedMarga(m); setQuery(''); }} // Reset query saat ganti tab
            className={`p-6 rounded-3xl border transition-all ${
              selectedMarga === m 
              ? 'bg-[#8B0000] text-white border-[#8B0000]' 
              : 'bg-white text-gray-800 border-gray-100 hover:border-[#8B0000]/30'
            }`}
          >
            <p className="text-[10px] uppercase font-bold">{m === 'Semua' ? 'Total' : 'Marga'}</p>
            <p className="font-bold text-lg">{m}</p>
            <p className="text-3xl font-black mt-2">{m === 'Semua' ? initialData.length : (stats[m] || 0)}</p>
          </button>
        ))}
      </div>

      {/* Input Pencarian */}
      <div className="relative">
        <input
          type="text"
          placeholder="Ketik nama untuk mencari..."
          className="w-full p-6 text-lg border-2 border-gray-100 rounded-3xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Grid Hasil (Hanya muncul jika sudah pilih filter atau sudah mengetik) */}
      {(selectedMarga || query) ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((k) => (
              <Link key={k.id} href={`/direktori/detail/${k.id}`} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg">
                <h3 className="font-bold text-lg">{k.nama_kepala}</h3>
                <p className="text-sm text-gray-400">{k.marga}</p>
              </Link>
            ))
          ) : (
            <p className="col-span-3 text-center py-10 text-gray-400">Data tidak ditemukan.</p>
          )}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Pilih kategori Marga atau ketik nama untuk melihat data keluarga.
        </div>
      )}
    </div>
  );
}