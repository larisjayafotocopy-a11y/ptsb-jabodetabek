// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        
        {/* Konten utama akan mendorong footer ke bawah */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer Sederhana */}
        <footer className="bg-gray-900 text-white py-8 text-center border-t-4 border-batakRed">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} PTSB Jabodetabek. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}