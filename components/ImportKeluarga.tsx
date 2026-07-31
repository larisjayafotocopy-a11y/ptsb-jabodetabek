'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';

interface Profile {
  role: 'admin' | 'korwil';
  korwil_id: number | null;
}
interface Korwil {
  id: number;
  nama_wilayah: string;
}
interface Marga {
  id: number;
  nama_marga: string;
}

interface ParsedRow {
  nama_kepala: string;
  nama_istri: string;
  margaText: string;
  marga_id: number | null;
  alamat: string;
  no_telp: string;
  fotoFileName: string;
  matchedFile: File | null;
  anakList: string[];
  errors: string[];
}

const EXAMPLE_SIGNATURE = 'ahmad sihite';

export default function ImportKeluarga({
  profile,
  korwilList,
  margaList,
}: {
  profile: Profile;
  korwilList: Korwil[];
  margaList: Marga[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload');
  const [korwilId, setKorwilId] = useState<number | null>(profile.korwil_id);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [resultSummary, setResultSummary] = useState({ berhasil: 0, gagal: 0 });
  const [parseError, setParseError] = useState('');

  const findMargaId = (text: string): number | null => {
    const m = margaList.find((x) => x.nama_marga.trim().toLowerCase() === text.trim().toLowerCase());
    return m ? m.id : null;
  };

  const handleSpreadsheet = async (file: File) => {
    setParseError('');
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });

      const sheetName =
        wb.SheetNames.find((n) => n.toLowerCase().includes('data keluarga')) ||
        wb.SheetNames[wb.SheetNames.length - 1];
      const sheet = wb.Sheets[sheetName];

      const raw: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      const dataRows = raw.slice(1); // lewati baris header

      const parsed: ParsedRow[] = [];
      for (const r of dataRows) {
        const [
          nama_kepala,
          nama_istri,
          margaText,
          alamat,
          no_telp,
          fotoFileName,
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
        ] = (r as any[]).map((v) => (v === undefined || v === null ? '' : String(v).trim()));

        // Lewati baris kosong total
        if (!nama_kepala && !nama_istri && !margaText) continue;
        // Lewati baris contoh (dikenali dari isinya, bukan posisi baris —
        // supaya tetap aman baik korwil sudah hapus baris contoh atau belum)
        if (nama_kepala.toLowerCase() === EXAMPLE_SIGNATURE) continue;

        const errors: string[] = [];
        if (!nama_kepala) errors.push('Nama Kepala Keluarga kosong');

        const marga_id = margaText ? findMargaId(margaText) : null;
        if (margaText && !marga_id) errors.push(`Marga "${margaText}" tidak dikenali`);
        if (!margaText) errors.push('Marga kosong');

        const anakList = [a1, a2, a3, a4, a5, a6].filter((n) => n && n.length > 0);

        parsed.push({
          nama_kepala,
          nama_istri,
          margaText,
          marga_id,
          alamat,
          no_telp,
          fotoFileName,
          matchedFile: null,
          anakList,
          errors,
        });
      }

      if (parsed.length === 0) {
        setParseError('Tidak ada data yang terbaca. Pastikan file sesuai format template.');
        return;
      }

      setRows(parsed);
      setStep('preview');
    } catch (err: any) {
      setParseError('Gagal membaca file: ' + (err.message || 'format tidak dikenali'));
    }
  };

  const handlePhotoFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    setPhotoFiles(list);

    // Cocokkan otomatis ke tiap baris berdasarkan nama file
    setRows((prev) =>
      prev.map((row) => {
        if (!row.fotoFileName) return row;
        const match = list.find((f) => f.name.toLowerCase() === row.fotoFileName.toLowerCase());
        return { ...row, matchedFile: match || null };
      })
    );
  };

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  const handleImport = async () => {
    if (!korwilId) {
      alert('Wilayah belum ditentukan.');
      return;
    }

    setStep('importing');
    setProgress({ current: 0, total: validRows.length });

    let berhasil = 0;
    let gagal = 0;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      setProgress({ current: i + 1, total: validRows.length });

      try {
        let foto_url: string | null = null;
        if (row.matchedFile) {
          foto_url = await uploadImage(row.matchedFile, 'keluarga');
        }

        const { data: keluargaBaru, error: keluargaError } = await supabase
          .from('keluarga')
          .insert([
            {
              nama_kepala: row.nama_kepala,
              nama_istri: row.nama_istri || null,
              alamat: row.alamat || null,
              no_telp: row.no_telp || null,
              foto_url,
              marga_id: row.marga_id,
              korwil_id: korwilId,
            },
          ])
          .select('id')
          .single();

        if (keluargaError || !keluargaBaru) throw new Error(keluargaError?.message);

        if (row.anakList.length > 0) {
          await supabase
            .from('anak')
            .insert(row.anakList.map((nama_anak) => ({ keluarga_id: keluargaBaru.id, nama_anak })));
        }

        berhasil++;
      } catch {
        gagal++;
      }
    }

    setResultSummary({ berhasil, gagal });
    setStep('done');
  };

  // ============================================================
  // STEP: UPLOAD
  // ============================================================
  if (step === 'upload') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto space-y-6">
        {profile.role === 'admin' && (
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Wilayah Tujuan Import</label>
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
          <label className="text-[10px] font-bold text-gray-400 uppercase">1. Upload Spreadsheet</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => e.target.files && handleSpreadsheet(e.target.files[0])}
            className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          />
          <p className="text-xs text-gray-400 mt-1">File hasil isian dari template Data Keluarga.</p>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">2. Upload Semua Foto (opsional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handlePhotoFiles(e.target.files)}
            className="w-full p-3 rounded-xl border border-gray-100 mt-1"
          />
          <p className="text-xs text-gray-400 mt-1">
            Pilih semua file foto sekaligus — namanya harus sama persis dengan kolom "Nama File Foto" di
            spreadsheet.
          </p>
        </div>

        {parseError && <p className="text-red-600 text-sm">{parseError}</p>}
      </div>
    );
  }

  // ============================================================
  // STEP: PREVIEW
  // ============================================================
  if (step === 'preview') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-wrap gap-6 justify-between items-center">
          <div>
            <p className="font-bold text-gray-900">
              {validRows.length} data siap diimport
              {invalidRows.length > 0 && (
                <span className="text-red-600"> · {invalidRows.length} data dilewati (error)</span>
              )}
            </p>
            <p className="text-sm text-gray-500">
              {photoFiles.length} foto terupload, {rows.filter((r) => r.matchedFile).length} berhasil dicocokkan
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('upload')}
              className="px-5 py-3 rounded-xl border border-gray-200 font-bold text-gray-600"
            >
              Ulangi
            </button>
            <button
              onClick={handleImport}
              disabled={validRows.length === 0}
              className="px-5 py-3 rounded-xl bg-batakRed text-white font-bold hover:bg-batakDark transition disabled:opacity-40"
            >
              Import {validRows.length} Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Status</th>
                <th className="p-3">Nama Kepala</th>
                <th className="p-3">Marga</th>
                <th className="p-3">Foto</th>
                <th className="p-3">Anak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-t border-gray-100 ${r.errors.length > 0 ? 'bg-red-50' : ''}`}>
                  <td className="p-3">
                    {r.errors.length > 0 ? (
                      <span className="text-red-600 text-xs font-bold">⚠ {r.errors.join(', ')}</span>
                    ) : (
                      <span className="text-green-600 text-xs font-bold">✓ Valid</span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-gray-900">{r.nama_kepala || '-'}</td>
                  <td className="p-3">{r.margaText || '-'}</td>
                  <td className="p-3">
                    {r.fotoFileName ? (
                      r.matchedFile ? (
                        <span className="text-green-600">✓ {r.fotoFileName}</span>
                      ) : (
                        <span className="text-amber-600">tidak ditemukan</span>
                      )
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-3">{r.anakList.length > 0 ? r.anakList.join(', ') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ============================================================
  // STEP: IMPORTING
  // ============================================================
  if (step === 'importing') {
    const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
    return (
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto text-center space-y-4">
        <p className="font-bold text-gray-900">
          Mengimpor {progress.current} dari {progress.total}...
        </p>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="bg-batakRed h-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400">Jangan tutup halaman ini sampai selesai.</p>
      </div>
    );
  }

  // ============================================================
  // STEP: DONE
  // ============================================================
  return (
    <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto text-center space-y-4">
      <div className="text-4xl">✅</div>
      <p className="font-bold text-gray-900 text-lg">Import selesai!</p>
      <p className="text-gray-500">
        {resultSummary.berhasil} data berhasil disimpan
        {resultSummary.gagal > 0 && `, ${resultSummary.gagal} gagal`}.
      </p>
      <button
        onClick={() => router.push('/dashboard')}
        className="bg-batakRed text-white px-6 py-3 rounded-xl font-bold hover:bg-batakDark transition"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}
