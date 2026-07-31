import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ImportKeluarga from '@/components/ImportKeluarga';

export const dynamic = 'force-dynamic';

export default async function ImportKeluargaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, korwil_id')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  const [{ data: korwilList }, { data: margaList }] = await Promise.all([
    profile.role === 'admin'
      ? supabase.from('korwil').select('id, nama_wilayah').order('nama_wilayah')
      : Promise.resolve({ data: [] }),
    supabase.from('kategori_marga').select('id, nama_marga').order('nama_marga'),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tambah-keluarga" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Import Data Keluarga</h1>
        <p className="text-gray-500 text-center mb-10">
          Upload spreadsheet yang sudah diisi, beserta semua foto sekaligus.
        </p>

        <ImportKeluarga
          profile={profile as any}
          korwilList={korwilList || []}
          margaList={margaList || []}
        />
      </div>
    </main>
  );
}
