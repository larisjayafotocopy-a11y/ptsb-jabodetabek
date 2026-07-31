import Link from 'next/link';
import BeritaForm from '@/components/BeritaForm';

export default function BeritaBaruPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/kelola-berita" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali ke Kelola Berita
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">Tulis Berita Baru</h1>
        <BeritaForm />
      </div>
    </main>
  );
}
