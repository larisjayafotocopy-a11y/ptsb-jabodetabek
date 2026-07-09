export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DirektoriPage() {
  const { data: wilayahList } = await supabase
    .from('korwil')
    .select(`id, nama_wilayah, pengurus(nama, wa), keluarga(id)`);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section - Mengikuti lebar Navbar (max-w-7xl) */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Direktori Wilayah
          </h1>
          <p className="text-gray-600 text-base">
            Pilih Korwil untuk melihat data keluarga PTSB.
          </p>
        </div>
      </section>

      {/* Main Grid Content - Padding dan Lebar Sama dengan Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wilayahList?.map((wilayah) => {
            const ketua = wilayah.pengurus[0]; 
            return (
              <div 
                key={wilayah.id} 
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <Link href={`/direktori/${wilayah.id}`} className="block">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                      <span className="text-lg">📍</span>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-red-800 transition-colors">
                        {wilayah.nama_wilayah}
                      </h2>
                      <p className="text-xs font-medium text-gray-500">Korwil: {ketua?.nama || '-'}</p>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span>
                    <span className="font-extrabold text-lg text-gray-900">{wilayah.keluarga.length}</span>
                    <span className="text-gray-500 text-xs font-medium">Keluarga</span>
                  </div>
                  
                  <a 
                    href={`https://wa.me/${ketua?.wa}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm active:scale-95"
                  >
                    Chat
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}