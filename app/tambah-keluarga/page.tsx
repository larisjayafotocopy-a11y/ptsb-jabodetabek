import FormTambahKeluarga from '@/components/FormTambahKeluarga';

export default function TambahDataPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">
          Input Data Keluarga
        </h1>
        
        {/* Di sinilah form Anda akan muncul */}
        <FormTambahKeluarga />
        
      </div>
    </main>
  );
}