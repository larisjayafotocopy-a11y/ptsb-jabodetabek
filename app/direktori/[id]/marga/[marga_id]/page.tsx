import { supabase } from '@/lib/auth';
import Link from 'next/link';

export default async function MargaDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string, marga_id: string }>,
  searchParams: Promise<{ page?: string, q?: string }> 
}) {
  const { id, marga_id } = await params;
  const { page = '1', q = '' } = await searchParams;
  const currentPage = parseInt(page);
  const limit = 16; 
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const { data: margaInfo } = await supabase
    .from('kategori_marga')
    .select('nama_marga')
    .eq('id', marga_id)
    .single();

  let query = supabase
    .from('keluarga')
    .select('id, nama_kepala, foto_url', { count: 'exact' })
    .eq('korwil_id', id)
    .eq('marga_id', marga_id)
    .range(from, to);

  if (q) query = query.ilike('nama_kepala', `%${q}%`);

  const { data: keluarga, count } = await query;
  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link href={`/direktori/${id}`} className="text-red-900 font-bold mb-8 block hover:underline">
        ← Kembali
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
          Marga {margaInfo?.nama_marga}
        </h1>
        <form className="w-full md:w-64">
          <input 
            name="q" 
            placeholder="Cari nama..." 
            defaultValue={q} 
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-900 outline-none text-sm" 
          />
        </form>
      </div>

      {/* Grid 4x4 dengan Kartu Profil yang Elegan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {keluarga?.map((item: any) => (
          <Link 
            href={`/direktori/detail/${item.id}`}
            key={item.id} 
            className="flex flex-col items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Foto Profil Lingkaran dengan Border Emas */}
            <div className="w-24 h-24 rounded-full border-2 border-amber-600 p-1 mb-4 overflow-hidden shadow-md">
              <img 
                src={item.foto_url || '/placeholder.png'} 
                alt={item.nama_kepala} 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            
            {/* Nama Kepala Keluarga Saja (Minimalis & Elegan) */}
            <div className="text-center">
              <h3 className="text-sm font-black text-gray-900 uppercase leading-tight">
                {item.nama_kepala}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link 
              key={i} 
              href={`?page=${i + 1}&q=${q}`} 
              className={`px-4 py-2 rounded-lg font-bold ${currentPage === i + 1 ? 'bg-red-900 text-white' : 'bg-white border text-gray-600'}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}