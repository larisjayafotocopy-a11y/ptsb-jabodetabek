'use client';

import { useEffect, useRef } from 'react';

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Cuma isi konten dari luar (misal saat mode ubah, data lama datang dari server)
  // ketika editor masih kosong — supaya tidak mengganggu posisi kursor waktu
  // user sedang mengetik (kalau di-set ulang tiap render, kursor akan loncat).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML === '' && value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL link:');
    if (url) exec('createLink', url);
  };

  return (
    <div>
      <label className="text-[10px] font-bold text-gray-400 uppercase">Isi Artikel</label>
      <div className="mt-1 border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-gray-100 bg-gray-50">
          <button type="button" onClick={() => exec('bold')} className="px-3 py-1 rounded-lg font-bold text-sm hover:bg-gray-200">
            B
          </button>
          <button type="button" onClick={() => exec('italic')} className="px-3 py-1 rounded-lg italic text-sm hover:bg-gray-200">
            I
          </button>
          <button type="button" onClick={() => exec('insertUnorderedList')} className="px-3 py-1 rounded-lg text-sm hover:bg-gray-200">
            • List
          </button>
          <button type="button" onClick={insertLink} className="px-3 py-1 rounded-lg text-sm hover:bg-gray-200">
            🔗 Link
          </button>
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={() => ref.current && onChange(ref.current.innerHTML)}
          className="p-4 min-h-[200px] outline-none prose max-w-none text-sm"
        />
      </div>
    </div>
  );
}
