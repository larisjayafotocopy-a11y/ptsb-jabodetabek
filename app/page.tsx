export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/auth';
import PetaJabodetabek from '@/components/PetaJabodetabek';
import HomeSearch from '@/components/HomeSearch';
import DonutChart from '@/components/DonutChart';

export default async function Home() {
  const [
    { count: totalKeluarga },
    { data: korwilList, error: korwilError },
    { data: margaList, error: margaError },
    { data: keluargaList, error: keluargaError },
  ] = await Promise.all([
    supabase.from('keluarga').select('id', { count: 'exact', head: true }),
    supabase.from('korwil').select('id, nama_wilayah').order('nama_wilayah'),
    supabase.from('kategori_marga').select('id, nama_marga').order('nama_marga'),
    supabase
      .from('keluarga')
      .select('id, nama_kepala, nama_istri, foto_url, korwil_id, marga_id, kategori_marga(nama_marga)'),
  ]);

  // Kalau ada error di query, tampil di terminal (npm run dev), bukan diam-diam
  // jadi array kosong tanpa penjelasan.
  if (korwilError) console.error('[Home] Gagal ambil data korwil:', korwilError.message);
  if (margaError) console.error('[Home] Gagal ambil data marga:', margaError.message);
  if (keluargaError) console.error('[Home] Gagal ambil data keluarga:', keluargaError.message);

  const totalWilayah = korwilList?.length ?? 0;

  // Rincian per marga & per wilayah — dihitung dari data yang sudah diambil,
  // tidak ada query tambahan ke database.
  const MARGA_COLORS = ['#c1121f', '#eab308', '#1e3a8a'];
  const margaBreakdown = (margaList || []).map((m, i) => ({
    label: m.nama_marga,
    value: (keluargaList || []).filter((k) => k.marga_id === m.id).length,
    color: MARGA_COLORS[i % MARGA_COLORS.length],
  }));

  const korwilBreakdown = (korwilList || [])
    .map((k) => ({
      nama: k.nama_wilayah.replace('Wilayah ', ''),
      jumlah: (keluargaList || []).filter((x) => x.korwil_id === k.id).length,
    }))
    .sort((a, b) => b.jumlah - a.jumlah);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section dengan Background Pattern & Peta */}
      <section className="relative border-b border-gray-200 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">

          <h1 className="text-3xl md:text-5xl font-extrabold text-batakDark text-center mb-4 leading-tight">
              Horas! Selamat Datang di <br /> PTSB
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl text-lg">
              Sistem informasi dan silaturahmi Punguan Toga Sihite Dohot Boruna (PTSB) wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
          </p>

          {/* Peta Interaktif Jabodetabek — pin terhubung ke halaman korwil asli */}
          <PetaJabodetabek korwilList={korwilList || []} />

          {/* Pencarian: filter Wilayah + Marga + Nama */}
          <HomeSearch
            korwilList={korwilList || []}
            margaList={margaList || []}
            initialData={keluargaList || []}
          />
        </div>
      </section>

      {/* Section Statistik Cepat — angka asli dari database */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-batakRed hover:shadow-md transition">
                    <h3 className="text-4xl font-extrabold text-gray-800 text-center">{totalKeluarga ?? 0}</h3>
                    <p className="text-gray-500 uppercase tracking-wide text-sm mt-2 font-bold text-center mb-4">Keluarga Terdaftar</p>
                    <div className="space-y-1.5 border-t border-gray-100 pt-4">
                      {margaBreakdown.map((m) => (
                        <div key={m.label} className="flex justify-between text-sm">
                          <span className="text-gray-600">{m.label}</span>
                          <span className="font-bold text-gray-800">{m.value}</span>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-batakRed hover:shadow-md transition">
                    <h3 className="text-4xl font-extrabold text-gray-800 text-center">{totalWilayah}</h3>
                    <p className="text-gray-500 uppercase tracking-wide text-sm mt-2 font-bold text-center mb-4">Wilayah Cabang</p>
                    <div className="space-y-1.5 border-t border-gray-100 pt-4 max-h-32 overflow-y-auto pr-1">
                      {korwilBreakdown.map((k) => (
                        <div key={k.nama} className="flex justify-between text-sm">
                          <span className="text-gray-600">{k.nama}</span>
                          <span className="font-bold text-gray-800">{k.jumlah}</span>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-batakRed hover:shadow-md transition flex flex-col items-center justify-center">
                    <p className="text-gray-500 uppercase tracking-wide text-sm font-bold mb-4">Proporsi Marga</p>
                    <DonutChart data={margaBreakdown} />
                </div>
            </div>
        </div>
      </section>

      {/* Teaser ke halaman-halaman lain */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6 text-center">
          <a href="/tentang-kami" className="bg-gray-50 hover:bg-gray-100 p-8 rounded-3xl border border-gray-100 transition">
            <div className="text-3xl mb-3">🙏</div>
            <h3 className="font-bold text-gray-900 mb-1">Tentang Kami</h3>
            <p className="text-sm text-gray-500">Kenali sejarah dan filosofi PTSB Jabodetabek</p>
          </a>
          <a href="/berita" className="bg-gray-50 hover:bg-gray-100 p-8 rounded-3xl border border-gray-100 transition">
            <div className="text-3xl mb-3">📰</div>
            <h3 className="font-bold text-gray-900 mb-1">Berita & Ulaon</h3>
            <p className="text-sm text-gray-500">Kabar terbaru dari seluruh wilayah</p>
          </a>
          <a href="/galeri" className="bg-gray-50 hover:bg-gray-100 p-8 rounded-3xl border border-gray-100 transition">
            <div className="text-3xl mb-3">🖼️</div>
            <h3 className="font-bold text-gray-900 mb-1">Galeri</h3>
            <p className="text-sm text-gray-500">Dokumentasi kegiatan bersama</p>
          </a>
        </div>
      </section>

    </main>
  );
}
