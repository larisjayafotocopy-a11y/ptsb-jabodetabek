// components/CabangCard.tsx

interface CabangProps {
  nama: string;
  korwil: string;
  wa: string;
  jumlahKK: number;
}

export default function CabangCard({ nama, korwil, wa, jumlahKK }: CabangProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-batakRed transition duration-300 flex flex-col h-full">
      
      {/* Bagian Header Kartu */}
      <div className="flex items-center gap-4 mb-4">
        {/* Placeholder Foto Korwil */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-batakGold">
          <span className="text-gray-400 text-2xl">👤</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-batakDark">{nama}</h3>
          <p className="text-sm text-gray-500 font-medium">Korwil: {korwil}</p>
        </div>
      </div>

      {/* Bagian Info & Tombol */}
      <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-extrabold text-gray-800 text-lg">{jumlahKK}</span>
          <span className="text-gray-500 ml-1">Keluarga</span>
        </div>
        
        {/* Tombol WhatsApp Otomatis */}
        <a 
          href={`https://wa.me/${wa}?text=Horas%20Bapak%20${korwil},%20saya%20anggota%20PTSB%20ingin%20bertanya...`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-2"
        >
          Hubungi Korwil
        </a>
      </div>
    </div>
  );
}