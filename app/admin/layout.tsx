'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { isMasterAdmin } from '@/lib/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && isMasterAdmin(user.uid)) {
        setAuthorized(true);
      } else if (!user && !checking) {
        router.push('/');
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router, checking]);

  if (checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-pulse text-emerald-500 font-black uppercase tracking-[0.3em]">
          GC WAB Security...
        </div>
      </div>
    );
  }

  // FIXED: Added pt-24 to prevent the head from being cut off
  return (
    <div className="bg-gray-950 min-h-screen pt-24 pb-12">
      {authorized ? children : null}
    </div>
  );
}