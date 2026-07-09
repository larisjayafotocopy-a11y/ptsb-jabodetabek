export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8B0000] text-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
            S
          </div>
          <h1 className="text-2xl font-black text-gray-900">Selamat Datang</h1>
          <p className="text-gray-400 text-sm">Masuk untuk mengelola data</p>
        </div>

        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#8B0000]" />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#8B0000]" />
          
          <button className="w-full bg-[#8B0000] text-white py-4 rounded-2xl font-bold hover:bg-red-900 transition-all">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}