'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import RichTextEditor from '@/components/RichTextEditor';

interface Profile {
  role: 'admin' | 'korwil';
  korwil_id: number | null;
}
interface Korwil {
  id: number;
  nama_wilayah: string;
}

const KATEGORI_OPTIONS = ['Pengumuman', 'Kegiatan', 'Siriaon', 'Sitaonon'];

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') +
    '-' +
    Date.now().toString(36)
  );
}

export default function BeritaForm({ beritaId }: { beritaId?: number }) {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [korwilList, setKorwilList] = useState<Korwil[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCustomKategori, setIsCustomKategori] = useState(false);

  const [form, setForm] = useState({
    judul: '',
    kategori: 'Pengumuman',
    konten: '',
    foto_sampul: '',
    korwil_id: null as number | null,
  });

  useEffect(() => {
    const load = async () => {
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
      } else if (profileData?.korwil_id) {
        setForm((p) => ({ ...p, korwil_id: profileData.korwil_id }));
      }

      if (beritaId) {
        const { data: existing } = await supabase.from('berita').select('*').eq('id', beritaId).single();
        if (existing) {
          setForm({
            judul: existing.judul,
            kategori: existing.kategori,
            konten: existing.konten,
            foto_sampul: existing.foto_sampul || '',
            korwil_id: existing.korwil_id,
          });
          if (!KATEGORI_OPTIONS.includes(existing.kategori)) {
            setIsCustomKategori(true);
          }
        }
      }

      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beritaId]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.judul.trim() || !form.konten.trim()) {
      alert('Judul dan isi artikel wajib diisi.');
      return;
    }

    setSubmitting(true);

    let error;
    if (beritaId) {
      ({ error } = await supabase
        .from('berita')
        .update({
          judul: form.judul,
          kategori: form.kategori,
          konten: form.konten,
          foto_sampul: form.foto_sampul || null,
          status,
          korwil_id: form.korwil_id,
        })
        .eq('id', beritaId));
    } else {
      ({ error } = await supabase.from('berita').insert([
        {
          judul: form.judul,
          slug: slugify(form.judul),
          kategori: form.kategori,
          konten: form.konten,
          foto_sampul: form.foto_sampul || null,
          status,
          korwil_id: form.korwil_id,
        },
      ]));
    }

    if (error) {
      alert('Gagal simpan: ' + error.message);
      setSubmitting(false);
      return;
    }

    alert(status === 'published' ? 'Berita diterbitkan!' : 'Draft tersimpan!');
    router.push('/kelola-berita');
    router.refresh();
  };

  if (loading) return <p className="text-center text-gray-400 py-10">Memuat...</p>;
  if (!profile) return <p className="text-center text-red-600 py-10">Anda harus login.</p>;

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-5">
      {profile.role === 'admin' && (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Atas Nama Wilayah</label>
          <select
            className="w-full p-3 rounded-xl border border-gray-100 mt-1"
            value={form.korwil_id ?? ''}
            onChange={(e) => setForm({ ...form, korwil_id: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Admin Pusat (tanpa wilayah)</option>
            {korwilList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_wilayah}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Judul</label>
        <input
          type="text"
          required
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Kategori</label>
        <select
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          value={isCustomKategori ? '__custom__' : form.kategori}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setIsCustomKategori(true);
              setForm({ ...form, kategori: '' });
            } else {
              setIsCustomKategori(false);
              setForm({ ...form, kategori: e.target.value });
            }
          }}
        >
          {KATEGORI_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
          <option value="__custom__">✏️ Lainnya (tulis sendiri)</option>
        </select>

        {isCustomKategori && (
          <input
            type="text"
            required
            placeholder="Tulis nama kategori sendiri..."
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-100 mt-2"
          />
        )}
      </div>

      <ImageUpload
        folder="berita"
        label="Foto Sampul"
        value={form.foto_sampul}
        onChange={(url) => setForm({ ...form, foto_sampul: url })}
      />

      <RichTextEditor value={form.konten} onChange={(html) => setForm({ ...form, konten: html })} />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit('draft')}
          className="flex-1 border-2 border-batakRed text-batakRed py-3 rounded-xl font-bold hover:bg-red-50 transition disabled:opacity-50"
        >
          Simpan Draft
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit('published')}
          className="flex-1 bg-batakRed text-white py-3 rounded-xl font-bold hover:bg-batakDark transition disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : 'Terbitkan'}
        </button>
      </div>
    </div>
  );
}
