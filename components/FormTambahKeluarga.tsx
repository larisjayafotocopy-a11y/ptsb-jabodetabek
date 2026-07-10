'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  role: 'admin' | 'korwil';
  korwil_id: number | null;
}

interface Korwil {
  id: number;
  nama_wilayah: string;
}

const initialForm = {
  nama_kepala: '',
  nama_istri: '',
  alamat: '',
  nomor_telepon: '',
  marga: 'Sihite Pande Raja',
  korwil_id: null as number | null,
};

export default function FormTambahKeluarga() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [korwilList, setKorwilList] = useState<Korwil[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [anakList, setAnakList] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingProfile(false);
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, korwil_id')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      if (profileData?.role === 'admin') {
        const { data: korwilData } = await supabase
          .from('korwil')
          .select('id, nama_wilayah')
          .order('nama_wilayah');
        setKorwilList(korwilData || []);
      } else if (profileData?.korwil_id) {
        setFormData((prev) => ({ ...prev, korwil_id: profileData.korwil_id }));
      }

      setLoadingProfile(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnakChange = (index: number, value: string) => {
    setAnakList((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const addAnakField = () => setAnakList((prev) => [...prev, '']);

  const removeAnakField = (index: number) =>
    setAnakList((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

  const resetAll = () => {
    setFormData((prev) => ({
      ...initialForm,
      korwil_id: profile?.role === 'admin' ? prev.korwil_id : profile?.korwil_id ?? null,
    }));
    setAnakList(['']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.korwil_id) {
      alert('Wilayah (korwil) belum ditentukan. Hubungi admin jika ini bukan admin/korwil.');
      return;
    }

    setSubmitting(true);

    const namaAnakValid = anakList.map((n) => n.trim()).filter((n) => n.length > 0);

    // 1) Simpan data keluarga dulu, ambil id-nya
    const { data: keluargaBaru, error: keluargaError } = await supabase
      .from('keluarga')
      .insert([{ ...formData, jumlah_anak: namaAnakValid.length }])
      .select('id')
      .single();

    if (keluargaError || !keluargaBaru) {
      alert('Gagal simpan data keluarga: ' + keluargaError?.message);
      setSubmitting(false);
      return;
    }

    // 2) Simpan data anak (kalau ada), terhubung ke keluarga_id yang baru dibuat
    if (namaAnakValid.length > 0) {
      const { error: anakError } = await supabase.from('anak').insert(
        namaAnakValid.map((nama_anak) => ({
          keluarga_id: keluargaBaru.id,
          nama_anak,
        }))
      );

      if (anakError) {
        alert(
          'Data keluarga tersimpan, tapi data anak gagal disimpan: ' + anakError.message
        );
        setSubmitting(false);
        return;
      }
    }

    alert('Data berhasil disimpan!');
    resetAll();
    setSubmitting(false);
  };

  if (loadingProfile) {
    return <p className="text-center text-gray-400 py-10">Memuat...</p>;
  }

  if (!profile) {
    return (
      <p className="text-center text-red-600 py-10">
        Anda harus login sebagai korwil atau admin untuk menambah data keluarga.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto space-y-5"
    >
      <h2 className="text-2xl font-black text-[#8B0000]">Input Data Keluarga</h2>

      {profile.role === 'admin' && (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Wilayah (Korwil)</label>
          <select
            required
            className="w-full p-3 rounded-xl border border-gray-100 mt-1"
            value={formData.korwil_id ?? ''}
            onChange={(e) => setFormData({ ...formData, korwil_id: Number(e.target.value) })}
          >
            <option value="" disabled>
              Pilih wilayah
            </option>
            {korwilList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_wilayah}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Kepala Keluarga</label>
        <input
          type="text"
          required
          value={formData.nama_kepala}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          onChange={(e) => setFormData({ ...formData, nama_kepala: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Istri</label>
        <input
          type="text"
          value={formData.nama_istri}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          onChange={(e) => setFormData({ ...formData, nama_istri: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Alamat</label>
        <input
          type="text"
          value={formData.alamat}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Nomor Telepon</label>
        <input
          type="tel"
          value={formData.nomor_telepon}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
        />
      </div>

      {/* Daftar Anak — dinamis, bisa tambah/hapus baris */}
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Anak</label>
        <div className="space-y-2 mt-1">
          {anakList.map((nama, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder={`Nama anak ke-${i + 1}`}
                value={nama}
                onChange={(e) => handleAnakChange(i, e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-100"
              />
              {anakList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAnakField(i)}
                  className="px-3 rounded-xl border border-gray-200 text-gray-400 hover:text-red-700 hover:border-red-200"
                  aria-label="Hapus anak ini"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAnakField}
          className="mt-2 text-xs font-bold text-[#8B0000] hover:underline"
        >
          + Tambah Anak
        </button>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#8B0000] text-white py-4 rounded-2xl font-bold hover:bg-red-900 transition-all disabled:opacity-50"
      >
        {submitting ? 'Menyimpan...' : 'Simpan Profil Keluarga'}
      </button>
    </form>
  );
}
