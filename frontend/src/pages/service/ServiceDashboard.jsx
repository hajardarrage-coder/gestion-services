import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Inbox, RefreshCw } from 'lucide-react';
import { fetchDemandes } from '../../api/demandes';
import { useAuth } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';

const ServiceDashboard = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchDemandes();
      setDemandes(response.data || []);
    } catch (requestError) {
      setDemandes([]);
      setError(requestError.response?.data?.message || 'Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const counts = useMemo(() => {
    return demandes.reduce(
      (acc, demande) => {
        acc.total += 1;
        acc[demande.status] = (acc[demande.status] || 0) + 1;
        return acc;
      },
      { total: 0 },
    );
  }, [demandes]);

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
        label="Service"
        title="Dashboard"
        description="Statistiques uniquement. Le traitement des demandes est dans la page Demandes."
        actions={
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 font-semibold">
              Service ID : <span className="text-slate-900">{user?.service_id ?? '--'}</span>
            </div>
            <button type="button" onClick={loadStats} className="btn-minimal">
              <RefreshCw size={16} />
              Rafraichir
            </button>
          </div>
        }
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Inbox} label="Demandes" value={counts.total} helper="Total recues" />
        <StatCard
          icon={Clock3}
          label="En attente"
          value={counts.pending || counts.sent_to_service || 0}
          helper="A traiter"
          accent="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Traitees"
          value={counts.processed || 0}
          helper="Reponses envoyees"
          accent="from-emerald-500 to-green-500"
        />
      </div>
    </div>
  );
};

export default ServiceDashboard;
