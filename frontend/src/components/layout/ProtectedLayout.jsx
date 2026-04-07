import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const ProtectedLayout = ({ allowedRoles, language }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const getTitle = () => {
    switch(user?.role) {
      case 'admin': return 'Administration Centrale';
      case 'president': return 'Tableau de Bord Président';
      case 'service': return 'Espace Service';
      case 'student': return 'Espace Étudiant';
      default: return 'Portail FLSH';
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <Sidebar />
      <div className="md:pl-72 flex flex-col min-h-screen">
        <Navbar title={getTitle()} />
        <main className="flex-1 page-shell pt-8 pb-12">
          <div className="relative max-w-[1200px] mx-auto w-full">
            <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
            <div className="relative z-10 animate-slide-up">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
