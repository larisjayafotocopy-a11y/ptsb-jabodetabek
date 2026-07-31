import Link from 'next/link';
import GaleriForm from '@/components/GaleriForm';

export default function GaleriBaruPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/kelola-galeri" className="text-red-900 font-bold mb-8 block hover:underline">
          ← Kembali ke Kelola Galeri
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">Album Galeri Baru</h1>
        <GaleriForm />
      </div>
    </main>
  );
}
