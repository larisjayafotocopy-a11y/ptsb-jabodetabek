'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Props {
  mobile?: boolean;
}

export default function NavAuthButton({ mobile }: Props) {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  // Default ke false (bukan null) supaya tombol Login tetap tampil
  // walaupun pengecekan session gagal/lambat — tidak pernah "hang".
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    // getSession() baca dari local storage, TIDAK melakukan network request,
    // jadi tidak akan macet walau koneksi ke Supabase lambat/bermasalah.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setLoggedIn(!!data.session);
      })
      .catch(() => {
        // dibiarkan false kalau gagal, jangan sampai UI stuck
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setLoggedIn(!!session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const base = mobile
    ? 'bg-white text-batakRed py-2 rounded-md font-bold w-full text-center'
    : 'bg-white text-batakRed px-5 py-2 rounded-md font-bold hover:bg-gray-200 transition';

  const dashboardLink = mobile
    ? 'font-medium hover:text-batakGold'
    : 'font-medium hover:text-batakGold transition mr-2';

  if (loggedIn) {
    return (
      <div className={mobile ? 'flex flex-col gap-3' : 'flex items-center gap-3'}>
        <a href="/dashboard" className={dashboardLink}>
          Dashboard
        </a>
        <button onClick={handleLogout} className={base}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <a href="/login" className={base}>
      Login
    </a>
  );
}
