// components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="bg-batakRed text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo-ptsb.jpg" alt="Logo" className="h-12 w-12 bg-white rounded-full p-1 mr-3" />
          <div>
            <h1 className="font-bold text-lg leading-none">PTSB</h1>
          </div>
        </div>
        
        {/* Menu Utama */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <a href="/" className="hover:text-batakGold transition">Beranda</a>
          <a href="/direktori" className="hover:text-batakGold transition">Direktori</a>
          <a href="/tarombo" className="hover:text-batakGold transition">Tarombo</a>
          <a href="/berita" className="hover:text-batakGold transition">Berita & Ulaon</a>
          <a href="/galeri" className="hover:text-batakGold transition">Galeri</a>
        </div>

        <button className="bg-white text-batakRed px-5 py-2 rounded-md font-bold hover:bg-gray-200 transition">
          Login
        </button>
      </div>
    </nav>
  );
}