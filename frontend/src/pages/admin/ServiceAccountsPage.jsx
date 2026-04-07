import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const initialForm = { service_name: '', email: '', password: '' };

const ServiceAccountsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const apiBase = useMemo(() => import.meta.env.VITE_API_URL, []);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const openForCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    resetMessages();
    setIsOpen(true);
  };

  const openForEdit = (account) => {
    setEditingId(account.id);
    setForm({
      service_name: account.service_name,
      email: account.email,
      password: '',
    });
    resetMessages();
    setIsOpen(true);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    resetMessages();
    try {
      const res = await axios.get(`${apiBase}/service-accounts`);
      setItems(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des comptes service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    if (editingId) {
      const account = items.find((item) => item.id === editingId);
      setForm({
        service_name: account?.service_name || '',
        email: account?.email || '',
        password: '',
      });
    } else {
      setForm(initialForm);
    }
    resetMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setSubmitLoading(true);

    const payload = {
      service_name: form.service_name.trim(),
      email: form.email.trim(),
    };
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    try {
      if (editingId) {
        await axios.put(`${apiBase}/service-accounts/${editingId}`, payload);
        setSuccess('Compte service mis à jour.');
      } else {
        // password is required for create; already validated by backend but enforce frontend
        if (!payload.password) {
          setError('Le mot de passe est requis pour la création.');
          setSubmitLoading(false);
          return;
        }
        await axios.post(`${apiBase}/service-accounts`, payload);
        setSuccess('Compte service créé.');
      }
      setIsOpen(false);
      setForm(initialForm);
      await fetchAccounts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response?.data && typeof err.response.data === 'object'
            ? Object.values(err.response.data).flat().join(' ')
            : 'Une erreur est survenue.')
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (account) => {
    if (!account?.id) return;
    const confirmed = window.confirm(`Supprimer le compte service "${account.service_name}" ?`);
    if (!confirmed) return;

    resetMessages();
    try {
      await axios.delete(`${apiBase}/service-accounts/${account.id}`);
      setSuccess('Compte service supprime.');
      await fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression impossible.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Services</p>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des comptes service</h1>
        </div>
        <button
          type="button"
          onClick={openForCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-500 transition disabled:opacity-70"
        >
          Ajouter un service
        </button>
      </header>

      {(error || success) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || success}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Chargement...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Aucun compte service.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.service_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.email}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openForEdit(item)}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Éditer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="text-sm font-semibold text-rose-600 hover:text-rose-500"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {editingId ? 'Modifier' : 'Créer'}
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Modifier le service' : 'Nouveau service'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du service</label>
                <input
                  name="service_name"
                  value={form.service_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Scolarité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="service@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mot de passe {editingId ? '(laisser vide pour conserver)' : ''}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={editingId ? 'Optionnel' : 'Obligatoire'}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                  disabled={submitLoading}
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  disabled={submitLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 transition disabled:opacity-70"
                >
                  {submitLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />}
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAccountsPage;
