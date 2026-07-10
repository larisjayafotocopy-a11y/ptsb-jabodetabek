import { supabase } from '@/lib/auth';
import PengurusSection from '@/components/PengurusSection';
import Link from 'next/link';

export default async function DetailWilayah({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Ambil Data Korwil & Pengurus
  const { data: korwil } = await supabase.from('korwil').select('*, pengurus(*)').eq('id', id).single();
  
  // Ambil semua keluarga untuk menghitung statistik
  const { data: keluarga } = await supabase.from('keluarga').select('id, marga_id').eq('korwil_id', id);
  
  // Ambil daftar marga master
  const { data: kategoriMarga } = await supabase.from('kategori_marga').select('*');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link href={`/direktori`} className="text-red-900 font-bold mb-8 block hover:underline">
        ← Kembali
      </Link>
      {/* Header Wilayah */}
      <div className="text-center mb-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-red-900 mb-8 uppercase">{korwil?.nama_wilayah}</h1>
        <PengurusSection pengurus={korwil?.pengurus || []} />
      </div>

      {/* Ringkasan Marga - Tombol Menuju Halaman Marga */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Marga</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kategoriMarga?.map((m: any) => {
          const total = keluarga?.filter(k => k.marga_id === m.id).length || 0;
          return (
            <Link key={m.id} href={`/direktori/${id}/marga/${m.id}`} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-red-900 flex justify-between items-center transition-all">
              <span className="font-bold text-gray-800">{m.nama_marga}</span>
              <span className="bg-red-900 text-white px-4 py-1 rounded-full text-sm font-black">{total}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}