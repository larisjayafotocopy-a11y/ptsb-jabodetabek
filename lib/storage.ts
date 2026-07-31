import { createClient } from '@/lib/supabase/client';

const MAX_VIDEO_SIZE_MB = 50;

/**
 * Upload satu file gambar ke Supabase Storage (bucket "uploads"),
 * lalu return URL publiknya. folder contoh: 'pengurus' | 'keluarga' | 'berita' | 'galeri'
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('uploads').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Upload satu file (foto ATAU video) ke Supabase Storage.
 * Video dibatasi maksimal 50MB supaya upload tidak lambat/gagal dan
 * tidak menghabiskan kuota storage terlalu cepat.
 * Return url + tipe filenya ('foto' | 'video').
 */
export async function uploadMedia(
  file: File,
  folder: string
): Promise<{ url: string; tipe: 'foto' | 'video' }> {
  const isVideo = file.type.startsWith('video/');

  if (isVideo && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    throw new Error(`Video "${file.name}" terlalu besar (maks ${MAX_VIDEO_SIZE_MB}MB).`);
  }

  const url = await uploadImage(file, folder);
  return { url, tipe: isVideo ? 'video' : 'foto' };
}
