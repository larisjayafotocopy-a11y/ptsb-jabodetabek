'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/ImageUpload';

interface Profile {
  role: 'admin' | 'korwil';
  korwil_id: number | null;
}

interface Korwil {
  id: number;
  nama_wilayah: string;
}

interface Pengurus {
  id: number;
  nama: string;
  jabatan: string;
  wa: string | null;
  foto_url: string | null;
  korwil_id: number;
}

const initialForm = { id: null as number | null, nama: '', jabatan: '', wa: '', foto_url: '' };

export default function PengurusManager() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [korwilList, setKorwilList] = useState<Korwil[]>([]);
  const [selectedKorwil, setSelectedKorwil] = useState<number | null>(null);
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedKorwil) fetchPengurus(selectedKorwil);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKorwil]);

  const init = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
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
      if (korwilData && korwilData.length > 0) setSelectedKorwil(korwilData[0].id);
    } else {
      setSelectedKorwil(profileData?.korwil_id ?? null);
    }

    setLoading(false);
  };

  const fetchPengurus = async (korwilId: number) => {
    const { data } = await supabase
      .from('pengurus')
      .select('*')
      .eq('korwil_id', korwilId)
      .order('jabatan');
    setPengurusList(data || []);
  };

  const resetForm = () => setForm(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKorwil) return;

    if (form.id) {
      const { error } = await supabase
        .from('pengurus')
        .update({ nama: form.nama, jabatan: form.jabatan, wa: form.wa, foto_url: form.foto_url })
        .eq('id', form.id);
      if (error) {
        alert('Gagal update: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('pengurus').insert([
        {
          nama: form.nama,
          jabatan: form.jabatan,
          wa: form.wa,
          foto_url: form.foto_url || null,
          korwil_id: selectedKorwil,
        },
      ]);
      if (error) {
        alert('Gagal tambah: ' + error.message);
        return;
      }
    }

    resetForm();
    fetchPengurus(selectedKorwil);
  };

  const handleEdit = (p: Pengurus) =>
    setForm({ id: p.id, nama: p.nama, jabatan: p.jabatan, wa: p.wa || '', foto_url: p.foto_url || '' });

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pengurus ini?')) return;
    const { error } = await supabase.from('pengurus').delete().eq('id', id);
    if (error) {
      alert('Gagal hapus: ' + error.message);
      return;
    }
    if (selectedKorwil) fetchPengurus(selectedKorwil);
  };

  if (loading) return <p className="text-center text-gray-400 py-10">Memuat...</p>;
  if (!profile)
    return <p className="text-center text-red-600 py-10">Anda harus login untuk mengelola kepengurusan.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {profile.role === 'admin' && (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Pilih Wilayah</label>
          <select
            className="w-full p-3 rounded-xl border border-gray-100 mt-1"
            value={selectedKorwil ?? ''}
            onChange={(e) => {
              setSelectedKorwil(Number(e.target.value));
              resetForm();
            }}
          >
            {korwilList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_wilayah}
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-black text-[#8B0000]">{form.id ? 'Ubah Pengurus' : 'Tambah Pengurus'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nama"
            required
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="p-3 rounded-xl border border-gray-100"
          />
          <input
            placeholder="Jabatan (mis. Ketua)"
            required
            value={form.jabatan}
            onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
            className="p-3 rounded-xl border border-gray-100"
          />
          <input
            placeholder="Nomor WA (62812...)"
            value={form.wa}
            onChange={(e) => setForm({ ...form, wa: e.target.value })}
            className="p-3 rounded-xl border border-gray-100"
          />
        </div>

        <ImageUpload
          folder="pengurus"
          label="Foto Pengurus"
          value={form.foto_url}
          onChange={(url) => setForm({ ...form, foto_url: url })}
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-[#8B0000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-900"
          >
            {form.id ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-xl font-bold border border-gray-200"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {pengurusList.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
            <div>
              <p className="font-bold">{p.nama}</p>
              <p className="text-sm text-gray-500">{p.jabatan}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="text-sm font-bold text-blue-700">
                Ubah
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-sm font-bold text-red-700">
                Hapus
              </button>
            </div>
          </div>
        ))}
        {pengurusList.length === 0 && <p className="text-center text-gray-400">Belum ada pengurus.</p>}
      </div>
    </div>
  );
}
