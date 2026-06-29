'use client'; // Kita gunakan client component agar bisa memakai fitur pencarian nanti
import { useState } from 'react';

export default function TaromboPage() {
  // Data Dummy Keluarga (Nanti akan diambil dari Database)
  const dataKeluarga = [
    {
      id: 1,
      kepalaKeluarga: "A. Sihite (Op. Si Tiar)",
      istri: "Br. Simanjuntak",
      ompu: "Ompu Raja Dolly",
      sektor: "Cabang Bekasi",
      alamat: "Jl. Patriot Raya, Bekasi Barat",
      anak: ["Tiar Sihite (L)", "Budi Sihite (L)", "Sinta Br. Sihite (P)"]
    },
    {
      id: 2,
      kepalaKeluarga: "B. Sihite",
      istri: "Br. Nainggolan",
      ompu: "Ompu Raja Manggiling",
      sektor: "Cabang Jakarta Timur",
      alamat: "Perumnas Klender, Jakarta Timur",
      anak: ["Dodi Sihite (L)", "Rina Br. Sihite (P)"]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Halaman */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-batakDark mb-4">
            Direktori Tarombo & Keluarga
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Cari data silsilah dan informasi keluarga anggota PTSB Jabodetabek dengan mudah.
          </p>
        </div>

        {/* Kolom Pencarian */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex gap-4">
          <input 
            type="text" 
            placeholder="Ketik nama Kepala Keluarga, Istri, atau Ompu..." 
            className="w-full px-4 py-2 outline-none bg-gray-50 rounded-lg border border-gray-200 focus:border-batakRed transition"
          />
          <button className="bg-batakRed text-white px-8 py-2 rounded-lg font-bold hover:bg-batakDark transition shadow-md">
            Cari
          </button>
        </div>

        {/* Daftar Kartu Keluarga */}
        <div className="space-y-6">
          {dataKeluarga.map((keluarga) => (
            <div key={keluarga.id} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-batakRed hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {keluarga.kepalaKeluarga} <span className="text-gray-400 text-lg font-normal">&</span> {keluarga.istri}
                  </h3>
                  <p className="text-batakRed font-semibold mt-1">Keturunan: {keluarga.ompu}</p>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 text-center">
                  {keluarga.sektor}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Info Anak */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Daftar Anak:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {keluarga.anak.map((namaAnak, index) => (
                      <li key={index} className="font-medium">{namaAnak}</li>
                    ))}
                  </ul>
                </div>

                {/* Info Kontak & Alamat */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Informasi Domisili:</h4>
                  <p className="text-gray-700 font-medium mb-3">{keluarga.alamat}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition">
                    Lihat Detail / Ubah Data
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}