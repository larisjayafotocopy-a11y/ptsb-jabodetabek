// app/direktori/page.tsx
import KorwilCard from "../../components/KorwilCard";

export default function DirektoriPage() {
  // Ini adalah simulasi data (Data Dummy) yang nantinya akan diambil dari Database PostgreSQL
  const dataKorwil = [
    { id: 1, nama: "Korwil Jakarta Timur", korwil: "St. A. Sihite", wa: "6281234567890", jumlahKK: 245 },
    { id: 2, nama: "Korwil Bekasi", korwil: "B. Sihite", wa: "6281234567891", jumlahKK: 310 },
    { id: 3, nama: "Korwil Depok", korwil: "C. Sihite / Br. Simanjuntak", wa: "6281234567892", jumlahKK: 150 },
    { id: 4, nama: "Korwil Tangerang", korwil: "D. Sihite", wa: "6281234567893", jumlahKK: 180 },
    { id: 5, nama: "Korwil Jakarta Selatan", korwil: "E. Sihite", wa: "6281234567894", jumlahKK: 210 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-batakDark mb-4">
            Direktori Korwil PTSB
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Temukan informasi kepengurusan dan hubungi Koordinator Wilayah (Korwil) di area tempat tinggal Anda.
          </p>
        </div>

        {/* Grid Kartu Korwil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataKorwil.map((Korwil) => (
            <KorwilCard 
              key={Korwil.id}
              nama={Korwil.nama}
              korwil={Korwil.korwil}
              wa={Korwil.wa}
              jumlahKK={Korwil.jumlahKK}
            />
          ))}
        </div>

      </div>
    </main>
  );
}