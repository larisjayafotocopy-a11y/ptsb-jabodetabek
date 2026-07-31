import { DEFAULT_AVATAR } from '@/lib/constants';

export default function PengurusSection({ pengurus }: { pengurus: any[] }) {
  const ketua = pengurus.find(p => p.jabatan.toLowerCase().includes('ketua'));
  const sekretaris = pengurus.find(p => p.jabatan.toLowerCase().includes('sekretaris'));
  const bendahara = pengurus.find(p => p.jabatan.toLowerCase().includes('bendahara'));
  
  const display = [sekretaris, ketua, bendahara].filter(Boolean);

  return (
    <div className="w-full py-6">
      {/* Grid: 1 kolom di mobile, 3 kolom di desktop (md) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
        {display.map((p, i) => (
          <div 
            key={i} 
            className="flex items-center md:flex-col gap-4 md:gap-4 bg-white border border-gray-100 p-3 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Foto dengan Border Mewah */}
            <div className="w-16 h-16 md:w-32 md:h-32 rounded-full border-2 border-amber-600 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-red-900">
                <img 
                  src={p.foto_url || DEFAULT_AVATAR} 
                  alt={p.nama} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            
            {/* Teks */}
            <div className="text-left md:text-center">
              <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-red-900 uppercase">
                {p.jabatan}
              </p>
              <h3 className="text-sm md:text-lg font-black text-gray-900 mt-0.5 leading-tight uppercase">
                {p.nama}
              </h3>
              {/* Garis Aksen Emas (Hanya di Desktop) */}
              <div className="hidden md:block w-8 h-1 bg-amber-600 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
