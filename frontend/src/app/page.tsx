'use client';

// Navigation Hooks import kar rahe hain
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check kar rahe hain ki user logged in hai ya nahi
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Redirecting to PERN Todo...
        </p>
      </div>
    </div>
  );
}
