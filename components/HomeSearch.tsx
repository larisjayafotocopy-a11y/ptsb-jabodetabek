'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_AVATAR } from '@/lib/constants';

interface Korwil {
  id: number;
  nama_wilayah: string;
}

interface KategoriMarga {
  id: number;
  nama_marga: string;
}

interface KeluargaRow {
  id: number;
  nama_kepala: string;
  nama_istri: string | null;
  foto_url: string | null;
  korwil_id: number;
  marga_id: number | null;
  kategori_marga: { nama_marga: string } | { nama_marga: string }[] | null;
}

function getNamaMarga(row: KeluargaRow): string {
  if (!row.kategori_marga) return '';
  if (Array.isArray(row.kategori_marga)) return row.kategori_marga[0]?.nama_marga || '';
  return row.kategori_marga.nama_marga || '';
}

export default function HomeSearch({
  korwilList,
  margaList,
  initialData,
}: {
  korwilList: Korwil[];
  margaList: KategoriMarga[];
  initialData: KeluargaRow[];
}) {
  const [korwilId, setKorwilId] = useState('semua');
  const [margaId, setMargaId] = useState('semua');
  const [query, setQuery] = useState('');

  const isFiltering = korwilId !== 'semua' || margaId !== 'semua' || query.trim() !== '';

  const results = useMemo(() => {
    if (!isFiltering) return [];
    const q = query.trim().toLowerCase();
    return initialData.filter((k) => {
      const matchKorwil = korwilId === 'semua' || String(k.korwil_id) === korwilId;
      const matchMarga = margaId === 'semua' || String(k.marga_id) === margaId;
      const namaMarga = getNamaMarga(k);
      const matchNama =
        q === '' ||
        (k.nama_kepala || '').toLowerCase().includes(q) ||
        (k.nama_istri || '').toLowerCase().includes(q) ||
        namaMarga.toLowerCase().includes(q);
      return matchKorwil && matchMarga && matchNama;
    });
  }, [initialData, korwilId, margaId, query, isFiltering]);

  return (
    <div className="w-full max-w-3xl mx-auto transform -translate-y-16">
      <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={korwilId}
            onChange={(e) => setKorwilId(e.target.value)}
            className="p-3 rounded-2xl border border-gray-200 outline-none text-gray-700 bg-gray-50"
          >
            <option value="semua">Semua Wilayah</option>
            {korwilList.map((k) => (
              <option key={k.id} value={String(k.id)}>
                {k.nama_wilayah}
              </option>
            ))}
          </select>

          <select
            value={margaId}
            onChange={(e) => setMargaId(e.target.value)}
            className="p-3 rounded-2xl border border-gray-200 outline-none text-gray-700 bg-gray-50"
          >
            <option value="semua">Semua Marga</option>
            {margaList.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.nama_marga}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari Nama Sihite, Boru, Suami Boru, atau Sektor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 outline-none text-gray-700 bg-transparent text-lg"
          />
          <button
            type="button"
            className="bg-batakRed text-white px-8 py-4 rounded-full font-bold hover:bg-batakDark transition shadow-md whitespace-nowrap"
          >
            Cari Data
          </button>
        </div>
      </div>

      {isFiltering && (
        <div className="mt-4 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 max-h-96 overflow-y-auto text-left">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((k) => (
                <Link
                  key={k.id}
                  href={`/direktori/detail/${k.id}`}
                  className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100 hover:border-batakRed hover:shadow-md transition"
                >
                  <img
                    src={k.foto_url || DEFAULT_AVATAR}
                    alt={k.nama_kepala}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-600 mb-2"
                  />
                  <p className="font-bold text-gray-900 text-sm">{k.nama_kepala}</p>
                  <p className="text-xs text-gray-400">{getNamaMarga(k) || 'Marga tidak diketahui'}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-6">Data tidak ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}
