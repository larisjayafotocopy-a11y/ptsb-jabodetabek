// app/berita/page.tsx
export default function BeritaPage() {
  const daftarBerita = [
    {
      id: 1,
      kategori: "Sitaonon",
      judul: "Berita Dukacita: Telah berpulang ke rumah Bapa...",
      tanggal: "28 Juni 2026",
      icon: "🕯️", // Ikon lilin untuk duka
      warna: "border-black"
    },
    {
      id: 2,
      kategori: "Siriaon",
      judul: "Selamat atas Pemberkatan Pernikahan",
      tanggal: "25 Juni 2026",
      icon: "🎉", // Ikon pesta untuk suka
      warna: "border-green-600"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-batakDark uppercase tracking-tight mb-2">Warta PTSB</h1>
            <div className="h-1 w-20 bg-batakRed mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-6">
          {daftarBerita.map((berita) => (
            <div key={berita.id} className={`bg-white p-8 rounded-3xl shadow-xl border-l-[16px] ${berita.warna} hover:scale-[1.02] transition-transform duration-300`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{berita.icon}</div>
                <div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{berita.kategori}</span>
                    <p className="text-sm font-bold text-gray-500">{berita.tanggal}</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-extrabold text-gray-900 leading-snug mb-4">{berita.judul}</h2>
              
              <button className="flex items-center gap-2 text-batakRed font-bold hover:gap-4 transition-all">
                Baca Selengkapnya <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}