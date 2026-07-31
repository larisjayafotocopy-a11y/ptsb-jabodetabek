import Link from 'next/link';
import FormTambahKeluarga from '@/components/FormTambahKeluarga';

export default function TambahDataPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-4 text-center">
          Input Data Keluarga
        </h1>

        <div className="text-center mb-8">
          <a href="/import-keluarga" className="inline-block text-sm font-bold text-batakRed hover:underline">
            📊 Punya banyak data? Import dari spreadsheet →
          </a>
        </div>

        <FormTambahKeluarga />
      </div>
    </main>
  );
}
