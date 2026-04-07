import React, { useEffect, useMemo, useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { createDemande, deleteDemande, fetchDemandes, fetchWorkflowServices, sendDemande } from '../../api/demandes';
import axios from 'axios';

const statusLabels = {
  pending: 'En attente',
  sent_to_service: 'Envoyee au service',
  processed: 'Traitee',
  rejected: 'Rejetee',
};

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  sent_to_service: 'bg-blue-100 text-blue-800 border-blue-200',
  processed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
};

const DemandesPage = () => {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showManualServiceForm, setShowManualServiceForm] = useState(false);
  const [manualServiceName, setManualServiceName] = useState('');
  const [manualServiceEmail, setManualServiceEmail] = useState('');
  const [manualServicePassword, setManualServicePassword] = useState('');
  const [addingService, setAddingService] = useState(false);
  const [manualServiceError, setManualServiceError] = useState('');
  const [manualServiceSuccess, setManualServiceSuccess] = useState('');

  const loadDemandes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchDemandes();
      setItems(response.data || []);
    } catch (requestError) {
      setItems([]);
      setError(requestError.response?.data?.message || 'Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetchWorkflowServices();
      setServices(response.data || []);
    } catch {
      setServices([]);
    }
  };

  useEffect(() => {
    loadDemandes();
    loadServices();
  }, []);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setTargetRole('');
    setCreateError('');
    setShowManualServiceForm(false);
    setManualServiceName('');
    setManualServiceEmail('');
    setManualServicePassword('');
    setManualServiceError('');
    setManualServiceSuccess('');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (creating) return;
    setShowCreateModal(false);
  };

  const handleCreateDemande = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setCreateError('Ajoutez un titre de demande.');
      return;
    }
    if (!description.trim()) {
      setCreateError('Ajoutez une description.');
      return;
    }
    if (!targetRole) {
      setCreateError('Choisissez un role/service destinataire.');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      const created = await createDemande({
        title: title.trim(),
        type: 'Workflow',
        description: description.trim(),
      });

      if (targetRole !== 'president') {
        await sendDemande(created.data.id, Number(targetRole));
      }

      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setTargetRole('');
      await loadDemandes();
    } catch (requestError) {
      setCreateError(requestError.response?.data?.message || 'Impossible de creer la demande.');
    } finally {
      setCreating(false);
    }
  };

  const handleAddManualService = async () => {
    const serviceName = manualServiceName.trim();
    const serviceEmail = manualServiceEmail.trim();
    const servicePassword = manualServicePassword.trim();

    if (!serviceName) {
      setManualServiceError('Nom du service obligatoire.');
      return;
    }
    if (!serviceEmail) {
      setManualServiceError('Email du service obligatoire.');
      return;
    }
    if (servicePassword.length < 6) {
      setManualServiceError('Mot de passe: minimum 6 caracteres.');
      return;
    }

    setAddingService(true);
    setManualServiceError('');
    setManualServiceSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/service-accounts`, {
        service_name: serviceName,
        email: serviceEmail,
        password: servicePassword,
      });

      await loadServices();
      const createdId = response?.data?.id;
      if (createdId) {
        setTargetRole(String(createdId));
      }
      setManualServiceName('');
      setManualServiceEmail('');
      setManualServicePassword('');
      setShowManualServiceForm(false);
      setManualServiceSuccess('Service ajoute et selectionne.');
    } catch (requestError) {
      setManualServiceError(requestError.response?.data?.message || "Impossible d'ajouter le service.");
    } finally {
      setAddingService(false);
    }
  };

  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return items.filter((item) => {
      const statusValue = item.status || item.statut;
      const statusMatch = !status || statusValue === status;
      if (!needle) return statusMatch;

      const text = `${item.title || item.titre || ''} ${item.description || ''} ${
        item.service_account?.service_name || item.service_account?.name || ''
      }`;

      return statusMatch && text.toLowerCase().includes(needle);
    });
  }, [items, search, status]);

  const handleDeleteVisible = async () => {
    if (loading || filteredItems.length === 0) return;

    const confirmed = window.confirm(
      `Supprimer les ${filteredItems.length} demande(s) affichee(s) dans les resultats ?`
    );
    if (!confirmed) return;

    try {
      const results = await Promise.allSettled(
        filteredItems.map((item) => deleteDemande(item.id))
      );
      const deleted = results.filter((result) => result.status === 'fulfilled').length;
      const failed = results.length - deleted;

      if (failed === 0) {
        setError('');
      } else {
        setError(`${failed} demande(s) n'ont pas pu etre supprimee(s).`);
      }

      await loadDemandes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Suppression impossible.');
    }
  };

  return (
    <div className="page-shell space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight font-display">Demandes</h1>
          <p className="text-slate-500 text-sm mt-2">Liste separee des demandes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={openCreateModal} className="btn-primary">
            <PlusCircle size={16} />
            Creer une demande
          </button>
          <button type="button" onClick={loadDemandes} className="btn-minimal">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Rafraichir
          </button>
        </div>
      </div>

      <div className="card-minimal p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-slate-600">
            Recherche
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Role, service..."
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
            />
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Statut
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
            >
              <option value="">Tous</option>
              <option value="pending">En attente</option>
              <option value="sent_to_service">Envoyee au service</option>
              <option value="processed">Traitee</option>
              <option value="rejected">Rejetee</option>
            </select>
          </label>
        </div>
      </div>

      {error && (
        <div className="card-minimal border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="card-minimal p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-slate-900 font-display">Resultats</h2>
              <button
                type="button"
                onClick={handleDeleteVisible}
                disabled={loading || filteredItems.length === 0}
                className="rounded-lg border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Supprimer
              </button>
            </div>
            <p className="text-xs text-slate-500">Lecture et creation pour l'administration.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
            {filteredItems.length} Resultat{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Role cible</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Reponse</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                    Chargement...
                  </td>
                </tr>
              )}

              {!loading && filteredItems.map((item) => {
                const statusValue = item.status || item.statut;
                return (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{item.title || item.titre || `Demande #${item.id}`}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-pre-wrap">{item.description || '-'}</td>
                  <td className="px-4 py-3">{item.service_account?.service_name || item.service_account?.name || 'President'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${
                        statusStyles[statusValue] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {statusLabels[statusValue] || statusValue || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.response_data || item.response || '-'}</td>
                </tr>
              )})}

              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                    Aucune demande.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900 font-display">Creer une demande</h3>
              <button type="button" onClick={closeCreateModal} className="btn-minimal" disabled={creating}>
                Fermer
              </button>
            </div>

            <form className="space-y-4 p-6" onSubmit={handleCreateDemande}>
              <label className="block text-xs font-semibold text-slate-600">
                Titre de demande
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex: Liste des etudiants inscrits"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                />
              </label>

              <label className="block text-xs font-semibold text-slate-600">
                Description
                <textarea
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Expliquez votre besoin..."
                  className="mt-2 min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                />
              </label>

              <label className="block text-xs font-semibold text-slate-600">
                Role/service destinataire
                <select
                  required
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                >
                  <option value="">Choisir un role</option>
                  <option value="president">President</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.service_name || service.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">Service manquant ?</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualServiceForm((prev) => !prev);
                      setManualServiceError('');
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    disabled={addingService}
                  >
                    {showManualServiceForm ? 'Fermer' : 'Ajouter service manuel'}
                  </button>
                </div>

                {showManualServiceForm && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      value={manualServiceName}
                      onChange={(event) => setManualServiceName(event.target.value)}
                      placeholder="Nom du service"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                    />
                    <input
                      type="email"
                      value={manualServiceEmail}
                      onChange={(event) => setManualServiceEmail(event.target.value)}
                      placeholder="Email du service"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                    />
                    <input
                      type="password"
                      value={manualServicePassword}
                      onChange={(event) => setManualServicePassword(event.target.value)}
                      placeholder="Mot de passe (min 6)"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddManualService}
                        disabled={addingService}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {addingService ? 'Ajout...' : 'Ajouter ce service'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {manualServiceError && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {manualServiceError}
                </p>
              )}
              {manualServiceSuccess && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {manualServiceSuccess}
                </p>
              )}

              {createError && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {createError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeCreateModal} className="btn-minimal" disabled={creating}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creation...' : 'Creer la demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesPage;
