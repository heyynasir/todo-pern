'use client';

// Client Hooks & Router import kar rahe hain
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../services/auth.service';
import { User } from '../types';

interface ProtectedRouteProps {
  children: (user: User) => React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = getCurrentUser();

    // Agar token ya user session missing hai to Login redirect karo
    if (!token || !currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return <>{user && children(user)}</>;
}
