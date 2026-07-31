export default function TentangKamiPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section - sama gaya seperti Direktori, Berita, Galeri */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Mengenal PTSB Jabodetabek
          </h1>
          <p className="text-gray-600 text-base">Sejarah, filosofi, dan tujuan perkumpulan kami.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 leading-relaxed mb-4 text-lg">
            Punguan Toga Sihite Dohot Boruna (PTSB) Jabodetabek adalah wadah persaudaraan bagi
            seluruh keturunan leluhur Toga Sihite di tanah perantauan.
          </p>
          <blockquote className="border-l-4 border-batakRed pl-4 italic text-gray-500 my-6 bg-white p-4 rounded-r-lg shadow-sm">
            "Poda ni Ompung: Sisada lulu anak, sisada lulu boru. Punguan ini menjunjung tinggi nilai
            filosofi Dalihan Na Tolu dalam setiap langkahnya."
          </blockquote>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            Kami hadir untuk mempererat tali silaturahmi, melestarikan adat istiadat, dan saling
            menopang dalam sukacita maupun dukacita bagi seluruh anggota di Jakarta, Bogor, Depok,
            Tangerang, dan Bekasi.
          </p>

          <div className="bg-white h-80 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-gray-400 font-bold text-xl mb-2">[ Area Foto Dokumentasi / Tugu ]</div>
            <p className="text-gray-500 text-sm">Tempat untuk foto kegiatan PTSB</p>
          </div>
        </div>
      </div>
    </main>
  );
}
