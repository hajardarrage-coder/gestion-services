import React, { useEffect, useMemo, useState } from 'react';
import { Send, PlusCircle, Trash2, Edit3 } from 'lucide-react';
import {
  createDemande,
  deleteDemande,
  fetchDemandes,
  fetchWorkflowServices,
  sendDemande,
  updateDemande,
} from '../../api/demandes';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  sent_to_service: 'bg-blue-100 text-blue-800 border-blue-200',
  processed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
};

const emptyForm = { student_name: '', type: '', description: '' };

const PresidentDemandesPage = () => {
  const [services, setServices] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [sendTarget, setSendTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dRes, sRes] = await Promise.all([fetchDemandes(), fetchWorkflowServices()]);
      setDemandes(dRes.data || []);
      setServices(sRes.data || []);
    } catch {
      setDemandes([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (editingId) {
        await updateDemande(editingId, form);
        setMessage('Demande mise a jour.');
      } else {
        await createDemande(form);
        setMessage('Demande creee.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return;

    try {
      await deleteDemande(id);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Suppression impossible.');
    }
  };

  const handleSend = async (id) => {
    if (!selectedService) {
      setMessage('Choisissez un service avant envoi.');
      return;
    }

    try {
      await sendDemande(id, Number(selectedService));
      setMessage('Demande envoyee au service.');
      setSendTarget(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible d'envoyer la demande.");
    }
  };

  const handleClearForm = () => {
    if (editingId) {
      const current = demandes.find((item) => item.id === editingId);
      if (current) {
        setForm({
          student_name: current.student_name || '',
          type: current.type || '',
          description: current.description || '',
        });
        return;
      }
    }
    setForm(emptyForm);
  };

  const totalByStatus = useMemo(() => {
    return demandes.reduce((acc, demande) => {
      acc[demande.status] = (acc[demande.status] || 0) + 1;
      return acc;
    }, {});
  }, [demandes]);

  return (
    <div className="space-y-10 font-inter">
      <DashboardHeader
        label="Presidence"
        title="Page Demandes"
        description="Creer, envoyer et suivre les demandes depuis cette page dediee."
        actions={
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
            }}
            className="btn-primary"
          >
            <PlusCircle size={18} />
            Nouvelle demande
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Send} label="Total demandes" value={demandes.length} helper="Brouillons et envoyees" />
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

      <section className="panel-glass">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {editingId ? 'Modifier la demande' : 'Nouvelle demande'}
          </h2>
          {message && <span className="text-xs text-slate-600 font-semibold">{message}</span>}
        </div>
        <form className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nom etudiant</label>
            <input
              className="input-minimal"
              value={form.student_name}
              onChange={(event) => setForm({ ...form, student_name: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Type</label>
            <input
              className="input-minimal"
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              className="input-minimal min-h-[120px]"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="button" onClick={handleClearForm} className="btn-ghost">
              Effacer
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {editingId ? 'Mettre a jour' : 'Creer'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel-glass">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Demandes</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className="input-minimal w-56"
            >
              <option value="">Choisir un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.service_name || service.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={loadData} className="btn-ghost">
              Actualiser
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-card">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-6">
                <th className="px-6 py-3">Etudiant</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Statut</th>
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
                    Aucune demande.
                  </td>
                </tr>
              )}
              {demandes.map((demande) => (
                <tr key={demande.id} className="table-row">
                  <td className="px-6 py-5 font-bold text-slate-900">{demande.student_name}</td>
                  <td className="px-6 py-5 text-slate-600 font-semibold">{demande.type}</td>
                  <td className="px-6 py-5 text-slate-600 font-semibold">
                    {demande.service_account?.service_name || demande.service_account?.name || '--'}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${
                        statusColors[demande.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {demande.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-600 whitespace-pre-wrap">{demande.response_data || '--'}</td>
                  <td className="px-6 py-5 text-right space-x-2">
                    {demande.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => {
                            setForm({
                              student_name: demande.student_name,
                              type: demande.type,
                              description: demande.description || '',
                            });
                            setEditingId(demande.id);
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button type="button" className="btn-primary" onClick={() => setSendTarget(demande.id)}>
                          <Send size={16} />
                          Envoyer
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(demande.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-500">En cours/clos</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {sendTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Envoyer au service</h3>
            <p className="text-sm text-slate-600">Selectionnez le service pour la demande #{sendTarget}.</p>
            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className="input-minimal w-full"
            >
              <option value="">Choisir un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.service_name || service.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setSendTarget(null)}>
                Annuler
              </button>
              <button type="button" className="btn-primary" onClick={() => handleSend(sendTarget)}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresidentDemandesPage;
