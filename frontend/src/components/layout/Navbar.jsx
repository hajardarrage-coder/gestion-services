import React from 'react';
import { Bell, Search, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  return (
    <nav className="px-8 py-4 flex items-center gap-6 border-b border-slate-200/70 bg-white/80 sticky top-0 z-40 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-semibold">Workspace</span>
        <span className="text-sm font-semibold text-slate-900">{title}</span>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full h-12 rounded-2xl bg-white border border-slate-200 pl-12 pr-20 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/80 transition-all shadow-[0_12px_24px_rgba(15,23,42,0.06)]"
            placeholder="Quick search... (Press Ctrl+K)"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-slate-400">
            <Command size={12} /> K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-10 w-10 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-all shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
          <Bell size={18} className="mx-auto" />
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-900">{user?.name || 'Admin'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
