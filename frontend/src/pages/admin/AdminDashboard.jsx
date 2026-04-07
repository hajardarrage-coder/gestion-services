import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, ClipboardList, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';

const INITIAL_SUMMARY = {
  total_students: 0,
  total_personnel: 0,
  total_batiments: 0,
  total_demandes: 0,
  pending_demandes: 0,
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/summary`);
      setSummary({
        total_students: Number(response.data?.total_students || 0),
        total_personnel: Number(response.data?.total_personnel || 0),
        total_batiments: Number(response.data?.total_batiments || 0),
        total_demandes: Number(response.data?.total_demandes || 0),
        pending_demandes: Number(response.data?.pending_demandes || 0),
      });
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const cards = [
    {
      label: 'Total Etudiants',
      value: summary.total_students.toLocaleString(),
      icon: Users,
      accent: 'from-indigo-500 to-blue-500',
    },
    {
      label: 'Total Personnel',
      value: summary.total_personnel.toLocaleString(),
      icon: ShieldCheck,
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Total Batiments',
      value: summary.total_batiments.toLocaleString(),
      icon: Building2,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Total Demandes',
      value: summary.total_demandes.toLocaleString(),
      helper: `${summary.pending_demandes} en attente`,
      icon: ClipboardList,
      accent: 'from-sky-500 to-cyan-500',
    },
  ];

  if (loading) {
    return (
      <div className="card-minimal flex items-center justify-center min-h-[280px]">
        <div className="flex items-center gap-3 text-slate-500 font-semibold">
          <RefreshCw className="animate-spin" size={18} />
          Chargement des statistiques...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        label="Overview"
        title="Tableau de bord administrateur"
        description="Vue globale des statistiques. Cette page contient uniquement des chiffres."
        actions={
          <button
            type="button"
            onClick={fetchSummary}
            className="btn-minimal bg-gradient-to-r from-slate-900 to-slate-800 hover:shadow-xl"
          >
            <RefreshCw size={16} />
            Rafraichir
          </button>
        }
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
