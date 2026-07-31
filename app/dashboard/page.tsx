import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const MENU = [
  { href: '/tambah-keluarga', title: 'Data Keluarga', desc: 'Tambah & kelola data keluarga', icon: '👨‍👩‍👧‍👦' },
  { href: '/kelola-pengurus', title: 'Kepengurusan', desc: 'Kelola susunan pengurus', icon: '🧑‍💼' },
  { href: '/kelola-berita', title: 'Berita & Ulaon', desc: 'Tulis & kelola berita', icon: '📰' },
  { href: '/kelola-galeri', title: 'Galeri', desc: 'Kelola album foto kegiatan', icon: '🖼️' },
];

export default async function DashboardPage() {
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

  let namaWilayah: string | null = null;
  if (profile?.korwil_id) {
    const { data: korwil } = await supabase
      .from('korwil')
      .select('nama_wilayah')
      .eq('id', profile.korwil_id)
      .single();
    namaWilayah = korwil?.nama_wilayah || null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Halo, {profile?.role === 'admin' ? 'Admin' : namaWilayah || 'Korwil'} 👋
        </h1>
        <p className="text-gray-500 mb-10">
          {profile?.role === 'admin'
            ? 'Anda punya akses penuh ke semua wilayah.'
            : `Kelola data untuk wilayah ${namaWilayah || 'Anda'} di sini.`}
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-batakRed transition-all flex items-center gap-4"
            >
              <span className="text-3xl">{m.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900">{m.title}</h3>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
