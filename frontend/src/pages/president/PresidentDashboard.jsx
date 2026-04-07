import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, RefreshCw, Send } from 'lucide-react';
import { fetchDemandes, fetchWorkflowServices } from '../../api/demandes';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';

const PresidentDashboard = () => {
  const [demandes, setDemandes] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [demandesRes, servicesRes] = await Promise.all([fetchDemandes(), fetchWorkflowServices()]);
      setDemandes(demandesRes.data || []);
      setServices(servicesRes.data || []);
    } catch (requestError) {
      setDemandes([]);
      setServices([]);
      setError(requestError.response?.data?.message || 'Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalByStatus = useMemo(() => {
    return demandes.reduce((acc, demande) => {
      acc[demande.status] = (acc[demande.status] || 0) + 1;
      return acc;
    }, {});
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
        label="Presidence"
        title="Dashboard"
        description="Statistiques uniquement. La gestion des demandes est dans la page Demandes."
        actions={
          <button type="button" onClick={loadStats} className="btn-minimal">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={ClipboardList} label="Demandes" value={demandes.length} helper="Total" />
        <StatCard
          icon={Send}
          label="En cours"
          value={totalByStatus.sent_to_service || 0}
          helper="En attente des services"
          accent="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Send}
          label="Services"
          value={services.length}
          helper="Destinataires disponibles"
          accent="from-sky-500 to-cyan-500"
        />
      </div>
    </div>
  );
};

export default PresidentDashboard;
