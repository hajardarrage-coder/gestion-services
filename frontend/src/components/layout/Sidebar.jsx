import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  Layers,
  LogOut,
  FileText,
  UserCog,
  Building2,
} from 'lucide-react';
import logo from '../../assets/university_logo.png';
import { useAuth } from '../../context/AuthContext';

const ROLE_TITLES = {
  admin: 'Admin',
  president: 'President',
  service: 'Service',
  student: 'Etudiant',
};

const ROLE_MENUS = {
  admin: [
    {
      label: 'Overview',
      items: [{ title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' }],
    },
    {
      label: 'Management',
      items: [
        { title: 'Demandes', icon: FileText, path: '/admin/demandes' },
        { title: 'Etudiants', icon: Users, path: '/admin/etudiants' },
        { title: 'Personnel', icon: UserCog, path: '/admin/personnel' },
        { title: 'Batiments', icon: Building2, path: '/admin/batiments' },
        { title: 'Services', icon: Layers, path: '/admin/services' },
      ],
    },
  ],
  president: [
    {
      label: 'Overview',
      items: [{ title: 'Dashboard', icon: LayoutDashboard, path: '/president/dashboard' }],
    },
    {
      label: 'Operations',
      items: [{ title: 'Demandes', icon: FileText, path: '/president/demandes' }],
    },
  ],
  service: [
    {
      label: 'Overview',
      items: [{ title: 'Dashboard', icon: LayoutDashboard, path: '/service/dashboard' }],
    },
    {
      label: 'Operations',
      items: [{ title: 'Demandes', icon: FileText, path: '/service/demandes' }],
    },
  ],
  student: [
    {
      label: 'Overview',
      items: [{ title: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' }],
    },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || '';
  const menuGroups = ROLE_MENUS[role] || [];

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/logout`);
    } catch (error) {
      // clear local auth even when backend session is already closed
    } finally {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-white via-white to-slate-50 border-r border-slate-200/70 flex flex-col backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <div className="p-7 border-b border-slate-200/70 bg-white/90">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <img src={logo} alt="FLSH" className="h-6 w-6 object-contain brightness-200" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">FLSH</p>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none font-display">
              {ROLE_TITLES[role] || 'Portail'}
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              {group.label}
            </p>
            <div className="mt-3 space-y-2">
              {group.items.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-5 border-t border-slate-200/70 bg-white/90">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
        >
          <LogOut size={18} />
          Deconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
