import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Inbox, RefreshCw, Send } from 'lucide-react';
import { fetchDemandes, respondToDemande } from '../../api/demandes';
import { useAuth } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  sent_to_service: 'bg-blue-100 text-blue-800 border-blue-200',
  processed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
};

const ServiceDemandesPage = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalDemande, setModalDemande] = useState(null);
  const [responseData, setResponseData] = useState('');
  const [decision, setDecision] = useState('processed');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDemandes = async () => {
    setLoading(true);
    try {
      const response = await fetchDemandes();
      setDemandes(response.data || []);
    } catch {
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  const openRespond = (demande) => {
    setModalDemande(demande);
    setResponseData(demande.response_data || '');
    setDecision('processed');
    setMessage('');
  };

  const submitResponse = async () => {
    if (!modalDemande) return;

    setSubmitting(true);
    setMessage('');
    try {
      await respondToDemande(modalDemande.id, { response_data: responseData, decision });
      setMessage('Reponse envoyee.');
      setModalDemande(null);
      await loadDemandes();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la reponse.');
    } finally {
      setSubmitting(false);
    }
  };

  const counts = demandes.reduce(
    (acc, demande) => {
      acc.total += 1;
      acc[demande.status] = (acc[demande.status] || 0) + 1;
      return acc;
    },
    { total: 0 },
  );

  return (
    <div className="space-y-10 font-inter">
      <DashboardHeader
        label="Service"
        title="Page Demandes"
        description="Traiter les demandes assignees depuis cette page dediee."
        actions={
          <div className="text-xs text-slate-500 font-semibold">
            Service ID : <span className="text-slate-900">{user?.service_id ?? '--'}</span>
          </div>
        }
      />

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

      <section className="panel-glass">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Liste des demandes</h2>
          <button type="button" onClick={loadDemandes} className="btn-ghost">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-card">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-6">
                <th className="px-6 py-3">Etudiant</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Reponse</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500 text-sm">
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && demandes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500 text-sm">
                    Aucune demande assignee.
                  </td>
                </tr>
              )}
              {demandes.map((demande) => (
                <tr key={demande.id} className="table-row">
                  <td className="px-6 py-5 font-bold text-slate-900">{demande.student_name}</td>
                  <td className="px-6 py-5 text-slate-600 font-semibold">{demande.type}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${
                        statusColors[demande.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {demande.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-600 whitespace-pre-wrap">{demande.description}</td>
                  <td className="px-6 py-5 text-xs text-slate-600 whitespace-pre-wrap">{demande.response_data || '--'}</td>
                  <td className="px-6 py-5 text-right">
                    {['pending', 'sent_to_service'].includes(demande.status) ? (
                      <button type="button" className="btn-primary" onClick={() => openRespond(demande)}>
                        <Send size={16} />
                        Repondre
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Clos</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalDemande && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Repondre a la demande #{modalDemande.id}</h3>
            <p className="text-sm text-slate-600">Etudiant : {modalDemande.student_name}</p>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Reponse</label>
              <textarea
                className="input-minimal min-h-[120px]"
                value={responseData}
                onChange={(event) => setResponseData(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  value="processed"
                  checked={decision === 'processed'}
                  onChange={(event) => setDecision(event.target.value)}
                />
                Valider
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  value="rejected"
                  checked={decision === 'rejected'}
                  onChange={(event) => setDecision(event.target.value)}
                />
                Rejeter
              </label>
            </div>
            {message && <p className="text-sm text-emerald-600 font-semibold">{message}</p>}
            <div className="flex items-center justify-end gap-3">
              <button type="button" className="btn-ghost" onClick={() => setModalDemande(null)}>
                Annuler
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setResponseData('');
                  setMessage('');
                }}
              >
                Effacer
              </button>
              <button type="button" className="btn-primary" disabled={submitting} onClick={submitResponse}>
                {submitting ? '...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDemandesPage;
