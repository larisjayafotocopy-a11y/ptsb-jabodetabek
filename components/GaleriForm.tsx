'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadMedia } from '@/lib/storage';

interface Profile {
  role: 'admin' | 'korwil';
  korwil_id: number | null;
}
interface Korwil {
  id: number;
  nama_wilayah: string;
}
interface MediaItem {
  url: string;
  tipe: 'foto' | 'video';
}

export default function GaleriForm() {
  const supabase = createClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [korwilList, setKorwilList] = useState<Korwil[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [korwilId, setKorwilId] = useState<number | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);

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
        setKorwilId(profileData.korwil_id);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');

    const newItems: MediaItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = await uploadMedia(file, 'galeri');
        newItems.push(result);
      } catch (err: any) {
        setUploadError((prev) => (prev ? prev + ' | ' : '') + (err.message || 'Gagal upload'));
      }
    }

    setMedia((prev) => [...prev, ...newItems]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!judul.trim()) {
      alert('Judul album wajib diisi.');
      return;
    }
    if (!korwilId) {
      alert('Wilayah belum ditentukan.');
      return;
    }
    if (media.length === 0) {
      alert('Upload minimal 1 foto atau video.');
      return;
    }

    setSubmitting(true);

    const sampul = media.find((m) => m.tipe === 'foto')?.url || media[0].url;

    const { data: album, error: albumError } = await supabase
      .from('galeri_album')
      .insert([{ judul, deskripsi, korwil_id: korwilId, foto_sampul: sampul }])
      .select('id')
      .single();

    if (albumError || !album) {
      alert('Gagal simpan album: ' + albumError?.message);
      setSubmitting(false);
      return;
    }

    const { error: fotoError } = await supabase.from('galeri_foto').insert(
      media.map((m, i) => ({ album_id: album.id, foto_url: m.url, tipe: m.tipe, urutan: i }))
    );

    if (fotoError) {
      alert('Album tersimpan, tapi sebagian media gagal: ' + fotoError.message);
    } else {
      alert('Album berhasil dibuat!');
    }

    router.push('/kelola-galeri');
    router.refresh();
  };

  if (loading) return <p className="text-center text-gray-400 py-10">Memuat...</p>;
  if (!profile) return <p className="text-center text-red-600 py-10">Anda harus login.</p>;

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto space-y-5">
      {profile.role === 'admin' && (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Wilayah</label>
          <select
            required
            className="w-full p-3 rounded-xl border border-gray-100 mt-1"
            value={korwilId ?? ''}
            onChange={(e) => setKorwilId(Number(e.target.value))}
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
        <label className="text-[10px] font-bold text-gray-400 uppercase">Judul Album</label>
        <input
          type="text"
          required
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Keterangan</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl border border-gray-100 mt-1"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">
          Foto & Video Kegiatan ({media.length} terpilih)
        </label>
        <div className="mt-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-batakRed hover:text-batakRed transition disabled:opacity-50"
          >
            {uploading ? 'Mengupload...' : 'Pilih Foto / Video (bisa banyak)'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Video maksimal 50MB per file, format MP4 disarankan.</p>
        {uploadError && <p className="text-red-600 text-xs mt-1">{uploadError}</p>}
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {media.map((m, i) => (
            <div key={i} className="relative">
              {m.tipe === 'video' ? (
                <div className="w-full h-16 rounded-lg bg-gray-800 flex items-center justify-center text-white text-lg">
                  ▶️
                </div>
              ) : (
                <img src={m.url} className="w-full h-16 object-cover rounded-lg" alt="" />
              )}
              <button
                type="button"
                onClick={() => setMedia((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        className="w-full bg-batakRed text-white py-4 rounded-2xl font-bold hover:bg-batakDark transition disabled:opacity-50"
      >
        {submitting ? 'Menyimpan...' : 'Simpan Album'}
      </button>
    </div>
  );
}
