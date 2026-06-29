// app/galeri/page.tsx
'use client';
import { useState } from 'react';

export default function GaleriPage() {
  // Simulasi data foto (bisa diperpanjang)
  const semuaFoto = [
    { id: 1, judul: "Pesta Bona Taon 2026", desc: "Perayaan awal tahun.", src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622" },
    { id: 2, judul: "Arisan Sektor Bekasi", desc: "Pertemuan rutin Bekasi.", src: "https://images.unsplash.com/photo-1543326563-125032338317" },
    { id: 3, judul: "Kegiatan Sosial", desc: "Bakti sosial wilayah Jakarta.", src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70" },
    { id: 4, judul: "Natal PTSB", desc: "Ibadah Natal Gabungan.", src: "https://images.unsplash.com/photo-1574359411659-1557205023d0" },
    { id: 5, judul: "Rapat Pengurus", desc: "Koordinasi pengurus pusat.", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4" },
    { id: 6, judul: "Pesta Budaya", desc: "Penampilan tortor anak muda.", src: "https://images.unsplash.com/photo-1516450360452-9312f5e86574" },
  ];

  // State untuk kontrol jumlah foto yang ditampilkan
  const [jumlahTampil, setJumlahTampil] = useState(3);

  const handleLoadMore = () => {
    setJumlahTampil(jumlahTampil + 3); // Menambah 3 foto setiap klik
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      {/* Container max-w-7xl dengan mx-auto memberikan margin yang seragam */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-batakDark uppercase mb-4">Galeri Foto</h1>
            <div className="h-1 w-20 bg-batakRed mx-auto rounded-full"></div>
        </div>

        {/* Grid 3 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {semuaFoto.slice(0, jumlahTampil).map((foto) => (
            <div key={foto.id} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
              <div className="aspect-video overflow-hidden rounded-xl mb-4">
                <img src={foto.src} alt={foto.judul} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{foto.judul}</h3>
              <p className="text-sm text-gray-500">{foto.desc}</p>
            </div>
          ))}
        </div>

        {/* Tombol Load More */}
        {jumlahTampil < semuaFoto.length && (
          <div className="text-center mt-12">
            <button 
              onClick={handleLoadMore}
              className="bg-batakRed text-white px-8 py-3 rounded-xl font-bold hover:bg-batakDark transition shadow-lg"
            >
              Muat Foto Lainnya
            </button>
          </div>
        )}
      </div>
    </main>
  );
}