'use client';

// Next.js Link aur React Icons import kar rahe hain
import Link from 'next/link';
import { HiCheckCircle, HiArrowRightOnRectangle, HiUserCircle } from 'react-icons/hi2';
import { logoutUser } from '../services/auth.service';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Title */}
        <Link href="/dashboard" className="group flex items-center gap-2.5 transition-transform active:scale-95">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 transition-all group-hover:shadow-indigo-500/40">
            <HiCheckCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300">
              PERN<span className="text-indigo-400">Todo</span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
              Production Stack
            </span>
          </div>
        </Link>

        {/* User Badge & Logout Section */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* User Profile Chip */}
            <div className="hidden items-center gap-2.5 rounded-full border border-slate-800 bg-slate-800/50 px-3.5 py-1.5 backdrop-blur-md sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white uppercase ring-2 ring-indigo-400/30">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="text-sm font-medium text-slate-200">
                {user.name}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 active:scale-95"
              title="Logout from Account"
            >
              <HiArrowRightOnRectangle className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
