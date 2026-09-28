'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { HiEnvelope, HiLockClosed, HiCheckCircle, HiArrowRight } from 'react-icons/hi2';
import { loginApi } from '../../services/auth.service';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both Email and Password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(formData);
      
      if (res.success) {
        toast.success(res.message || 'Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Server error! Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/30 ring-1 ring-white/20">
          <HiCheckCircle className="h-9 w-9 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in to manage your PERN Todo tasks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <HiEnvelope className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <HiLockClosed className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 underline">
              Register a New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
