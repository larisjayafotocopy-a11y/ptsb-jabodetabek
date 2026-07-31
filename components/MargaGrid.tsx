'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_AVATAR } from '@/lib/constants';

interface KeluargaItem {
  id: number;
  nama_kepala: string;
  foto_url: string | null;
}

const PAGE_SIZE = 16;

export default function MargaGrid({ initialData }: { initialData: KeluargaItem[] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialData;
    return initialData.filter((k) => (k.nama_kepala || '').toLowerCase().includes(q));
  }, [initialData, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-end items-center mb-10 gap-4">
        <div className="w-full md:w-64">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-900 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {pageData.map((item) => (
          <Link
            href={`/direktori/detail/${item.id}`}
            key={item.id}
            className="flex flex-col items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="w-24 h-24 rounded-full border-2 border-amber-600 p-1 mb-4 overflow-hidden shadow-md">
              <img
                src={item.foto_url || DEFAULT_AVATAR}
                alt={item.nama_kepala}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-gray-900 uppercase leading-tight">
                {item.nama_kepala}
              </h3>
            </div>
          </Link>
        ))}

        {pageData.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-10">Data tidak ditemukan.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-bold ${
                safePage === i + 1 ? 'bg-red-900 text-white' : 'bg-white border text-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
