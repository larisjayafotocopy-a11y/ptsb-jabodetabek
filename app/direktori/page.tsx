// app/direktori/page.tsx
import CabangCard from "../../components/CabangCard";

export default function DirektoriPage() {
  // Ini adalah simulasi data (Data Dummy) yang nantinya akan diambil dari Database PostgreSQL
  const dataCabang = [
    { id: 1, nama: "Cabang Jakarta Timur", korwil: "St. A. Sihite", wa: "6281234567890", jumlahKK: 245 },
    { id: 2, nama: "Cabang Bekasi", korwil: "B. Sihite", wa: "6281234567891", jumlahKK: 310 },
    { id: 3, nama: "Cabang Depok", korwil: "C. Sihite / Br. Simanjuntak", wa: "6281234567892", jumlahKK: 150 },
    { id: 4, nama: "Cabang Tangerang", korwil: "D. Sihite", wa: "6281234567893", jumlahKK: 180 },
    { id: 5, nama: "Cabang Jakarta Selatan", korwil: "E. Sihite", wa: "6281234567894", jumlahKK: 210 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-batakDark mb-4">
            Direktori Cabang PTSB
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Temukan informasi kepengurusan dan hubungi Koordinator Wilayah (Korwil) di area tempat tinggal Anda.
          </p>
        </div>

        {/* Grid Kartu Cabang */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataCabang.map((cabang) => (
            <CabangCard 
              key={cabang.id}
              nama={cabang.nama}
              korwil={cabang.korwil}
              wa={cabang.wa}
              jumlahKK={cabang.jumlahKK}
            />
          ))}
        </div>

      </div>
    </main>
  );
}