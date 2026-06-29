export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section dengan Background Pattern & Peta */}
      <section className="relative border-b border-gray-200 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
            
          <h1 className="text-3xl md:text-5xl font-extrabold text-batakDark text-center mb-4 leading-tight">
              Horas! Selamat Datang di <br /> PTSB
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl text-lg">
              Sistem informasi dan silaturahmi Punguan Toga Sihite Dohot Boruna (PTSB) wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
          </p>

          {/* Area Peta Interaktif Jabodetabek */}
          <div className="w-full h-80 md:h-[450px] bg-blue-50 rounded-2xl border border-gray-300 flex items-center justify-center relative mb-10 overflow-hidden shadow-inner">
              <div className="text-center z-10">
                  <p className="text-gray-600 font-bold text-xl">[ Area Peta JABODETABEK Interaktif ]</p>
                  <p className="text-sm text-gray-500 mt-2">Pilih area Korwil untuk melihat data keluarga</p>
              </div>
              
              {/* Pin Dummy Peta */}
              <div className="absolute top-1/4 left-1/3 bg-batakRed text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:bg-batakDark transition transform hover:scale-110">Korwil Jakarta Timur</div>
              <div className="absolute top-1/2 right-1/4 bg-batakRed text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:bg-batakDark transition transform hover:scale-110">Korwil Bekasi</div>
              <div className="absolute bottom-1/4 left-1/4 bg-batakRed text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:bg-batakDark transition transform hover:scale-110">Korwil Depok</div>
              <div className="absolute top-1/3 left-1/6 bg-batakRed text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:bg-batakDark transition transform hover:scale-110">Korwil Tangerang</div>
          </div>

          {/* Kotak Pencarian Mengambang */}
          <div className="w-full max-w-3xl bg-white p-2 rounded-full shadow-2xl border border-gray-200 flex items-center transform -translate-y-16">
              <input 
                type="text" 
                placeholder="Cari Nama Sihite, Boru, Suami Boru, atau Sektor..." 
                className="w-full p-4 outline-none text-gray-700 bg-transparent text-lg" 
              />
              <button className="bg-batakRed text-white px-8 py-4 rounded-full font-bold hover:bg-batakDark transition shadow-md">
                  Cari Data
              </button>
          </div>
        </div>
      </section>

      {/* Section Statistik Cepat */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-batakRed hover:shadow-md transition">
                    <h3 className="text-4xl font-extrabold text-gray-800">1,250</h3>
                    <p className="text-gray-500 uppercase tracking-wide text-sm mt-2 font-bold">Keluarga Terdaftar</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-batakRed hover:shadow-md transition">
                    <h3 className="text-4xl font-extrabold text-gray-800">5</h3>
                    <p className="text-gray-500 uppercase tracking-wide text-sm mt-2 font-bold">Wilayah Cabang</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-batakRed hover:shadow-md transition">
                    <h3 className="text-4xl font-extrabold text-gray-800">Tarombo</h3>
                    <p className="text-gray-500 uppercase tracking-wide text-sm mt-2 font-bold">Toga Sihite</p>
                </div>
            </div>
        </div>
      </section>

      {/* Section Tentang Kami (Sesuai kesepakatan sebelumnya) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-batakDark mb-6">Mengenal PTSB Jabodetabek</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Punguan Toga Sihite Dohot Boruna (PTSB) Jabodetabek adalah wadah persaudaraan bagi seluruh keturunan leluhur Toga Sihite di tanah perantauan.
            </p>
            <blockquote className="border-l-4 border-batakRed pl-4 italic text-gray-500 my-6 bg-gray-50 p-4 rounded-r-lg">
              "Poda ni Ompung: Sisada lulu anak, sisada lulu boru. Punguan ini menjunjung tinggi nilai filosofi Dalihan Na Tolu dalam setiap langkahnya."
            </blockquote>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Kami hadir untuk mempererat tali silaturahmi, melestarikan adat istiadat, dan saling menopang dalam sukacita maupun dukacita bagi seluruh anggota di Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
            </p>
            <button className="bg-transparent border-2 border-batakRed text-batakRed px-6 py-3 rounded-lg font-bold hover:bg-batakRed hover:text-white transition">
              Lihat Susunan Pengurus
            </button>
          </div>
          
          {/* Ilustrasi/Foto Placeholder */}
          <div className="bg-gray-100 h-96 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
            <div className="text-gray-400 font-bold text-xl mb-2">[ Area Foto Dokumentasi / Tugu ]</div>
            <p className="text-gray-500 text-sm">Tempat untuk foto kegiatan PTSB</p>
          </div>
        </div>
      </section>

    </main>
  );
}