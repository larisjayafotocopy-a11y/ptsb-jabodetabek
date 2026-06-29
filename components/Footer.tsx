// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-batakRed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bagian Utama Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Kolom 1: Tentang PTSB */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-widest">Tentang PTSB</h3>
            <p className="text-sm leading-relaxed">
              Punguan Toga Sihite Dohot Boruna (PTSB) Jabodetabek adalah wadah silaturahmi untuk mempererat persaudaraan marga Sihite beserta boru dan bere.
            </p>
          </div>

          {/* Kolom 2: Link Cepat */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-widest">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/direktori" className="hover:text-batakRed transition">Direktori Cabang</a></li>
              <li><a href="/tarombo" className="hover:text-batakRed transition">Silsilah (Tarombo)</a></li>
              <li><a href="/berita" className="hover:text-batakRed transition">Warta & Ulaon</a></li>
              <li><a href="/galeri" className="hover:text-batakRed transition">Galeri Foto</a></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-widest">Kontak Sekretariat</h3>
            <p className="text-sm">
              Jl. Contoh Alamat No. 123,<br />
              Jakarta, Indonesia.<br />
              Email: info@ptsb-jabodetabek.org
            </p>
          </div>
        </div>

        {/* Garis Pembatas */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} PTSB Jabodetabek. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}