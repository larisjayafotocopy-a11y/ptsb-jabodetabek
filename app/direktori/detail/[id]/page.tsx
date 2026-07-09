import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilKeluargaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mengambil data keluarga, anak, marga, dan id referensi untuk navigasi
  const { data: k, error } = await supabase
    .from('keluarga')
    .select(`*, anak(nama_anak), kategori_marga(nama_marga), korwil_id, marga_id`)
    .eq('id', id)
    .single();

  if (error || !k) notFound();

  // Memastikan link WhatsApp aman
  const waLink = k.no_telp ? `https://wa.me/${k.no_telp.toString().replace(/^0/, '62')}` : "#";

  // Membuat link kembali yang dinamis berdasarkan data asli
  const linkKembali = k.korwil_id && k.marga_id 
    ? `/direktori/${k.korwil_id}/marga/${k.marga_id}/` 
    : '/direktori/';

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Tombol Kembali yang akurat */}
      <Link href={linkKembali} className="text-red-900 font-bold mb-8 block hover:underline">
        ← Kembali
      </Link>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        {/* Foto Profil */}
        <div className="flex justify-center -mt-4 mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-md overflow-hidden">
            <img 
              src={k.foto_url || '/placeholder.png'} 
              alt={k.nama_kepala} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase">{k.nama_kepala}</h1>
          <p className="text-red-900 font-bold text-xs mt-2 uppercase tracking-widest">
            {k.kategori_marga?.nama_marga || 'TANPA MARGA'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Info Istri */}
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2"><span>👩‍🦰</span><span className="text-[10px] font-bold text-gray-400 uppercase">Istri</span></div>
            <span className="font-semibold text-gray-800 text-sm">{k.nama_istri || '-'}</span>
          </div>
          
          {/* Info Alamat */}
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2"><span>📍</span><span className="text-[10px] font-bold text-gray-400 uppercase">Alamat</span></div>
            <span className="font-semibold text-gray-800 text-sm text-right max-w-[150px]">{k.alamat || '-'}</span>
          </div>

          {/* Tombol WhatsApp */}
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition-all text-sm shadow-md">
            <span>💬</span> HUBUNGI WHATSAPP
          </a>

          {/* Daftar Anak */}
          <div className="pt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Daftar Anak</p>
            {k.anak && k.anak.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {k.anak.map((a: any, i: number) => (
                  <div key={i} className="text-xs font-medium text-gray-700 bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                    {a.nama_anak}
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400 italic text-xs text-center">Tidak ada data anak</p>}
          </div>
        </div>
      </div>
    </div>
  );
}