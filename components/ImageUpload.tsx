'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/storage';

export default function ImageUpload({
  folder,
  value,
  onChange,
  label = 'Foto',
  multiple = false,
  onMultipleChange,
}: {
  folder: string;
  value?: string | null;
  onChange?: (url: string) => void;
  label?: string;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      if (multiple && onMultipleChange) {
        const urls: string[] = [];
        for (const file of Array.from(files)) {
          urls.push(await uploadImage(file, folder));
        }
        onMultipleChange(urls);
      } else if (onChange) {
        const url = await uploadImage(files[0], folder);
        onChange(url);
      }
    } catch (err: any) {
      setError('Gagal upload: ' + (err.message || 'coba lagi'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
      <div className="mt-1 flex items-center gap-3 flex-wrap">
        {!multiple && value && (
          <img src={value} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-batakRed hover:text-batakRed transition disabled:opacity-50"
        >
          {uploading
            ? 'Mengupload...'
            : !multiple && value
            ? 'Ganti Foto'
            : multiple
            ? 'Pilih Foto (bisa banyak)'
            : 'Pilih Foto'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
