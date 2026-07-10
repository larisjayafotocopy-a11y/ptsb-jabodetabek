import PengurusManager from '@/components/PengurusManager';

export default function KelolaPengurusPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">Kelola Kepengurusan</h1>
      <PengurusManager />
    </main>
  );
}
