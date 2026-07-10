'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      console.error('Supabase signIn error:', signInError);
      setError(signInError?.message || 'Login gagal, coba lagi.');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const redirectTo = searchParams.get('redirectTo');
    const destination =
      redirectTo || (profile?.role === 'admin' ? '/kelola-pengurus' : '/tambah-keluarga');

    router.push(destination);
    router.refresh();
  };

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

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#8B0000]"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#8B0000]"
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B0000] text-white py-4 rounded-2xl font-bold hover:bg-red-900 transition-all disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
