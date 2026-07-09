'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function FormTambahKeluarga() {
  const [formData, setFormData] = useState({
    nama_kepala: '',
    nama_istri: '',
    jumlah_anak: 0,
    alamat: '',
    nomor_telepon: '',
    marga: 'Sihite Pande Raja'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logika pengiriman data ke Supabase
    const { error } = await supabase.from('keluarga').insert([formData]);

    if (error) alert('Gagal: ' + error.message);
    else {
      alert('Data berhasil disimpan!');
      setFormData({ nama_kepala: '', nama_istri: '', jumlah_anak: 0, alamat: '', nomor_telepon: '', marga: 'Sihite Pande Raja' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto space-y-5">
      <h2 className="text-2xl font-black text-[#8B0000]">Input Data Keluarga</h2>

      {/* Grid Input untuk Nama Istri & Anak agar hemat tempat */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Istri</label>
          <input type="text" className="w-full p-3 rounded-xl border border-gray-100 mt-1" onChange={(e) => setFormData({...formData, nama_istri: e.target.value})} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Jumlah Anak</label>
          <input type="number" className="w-full p-3 rounded-xl border border-gray-100 mt-1" onChange={(e) => setFormData({...formData, jumlah_anak: parseInt(e.target.value)})} />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Alamat</label>
        <input type="text" className="w-full p-3 rounded-xl border border-gray-100 mt-1" onChange={(e) => setFormData({...formData, alamat: e.target.value})} />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Nomor Telepon</label>
        <input type="tel" className="w-full p-3 rounded-xl border border-gray-100 mt-1" onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})} />
      </div>

      <button type="submit" className="w-full bg-[#8B0000] text-white py-4 rounded-2xl font-bold hover:bg-red-900 transition-all">
        Simpan Profil Keluarga
      </button>
    </form>
  );
}