import { supabase } from '@/lib/auth';
import Link from 'next/link';
import MargaGrid from '@/components/MargaGrid';

export const dynamic = 'force-dynamic';

export default async function MargaDetailPage({
  params,
}: {
  params: Promise<{ id: string; marga_id: string }>;
}) {
  const { id, marga_id } = await params;

  const [{ data: margaInfo }, { data: keluarga, error: keluargaError }] = await Promise.all([
    supabase.from('kategori_marga').select('nama_marga').eq('id', marga_id).single(),
    supabase
      .from('keluarga')
      .select('id, nama_kepala, foto_url')
      .eq('korwil_id', id)
      .eq('marga_id', marga_id)
      .order('nama_kepala'),
  ]);

  if (keluargaError) console.error('[MargaDetail] Gagal ambil data keluarga:', keluargaError.message);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href={`/direktori/${id}`} className="text-red-900 font-bold mb-8 block hover:underline">
        ← Kembali
      </Link>

      <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6">
        Marga {margaInfo?.nama_marga}
      </h1>

      <MargaGrid initialData={keluarga || []} />
    </div>
  );
}
