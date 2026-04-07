import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

const DemandeEditModal = ({ isOpen, onClose, demande, onSuccess }) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [services, setServices] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen || !demande) return;
    setTitre(demande.titre || '');
    setDescription(demande.description || '');
    setServiceId(demande.service_id ? String(demande.service_id) : '');
    setFile(null);
    setError('');
    setSuccess('');
  }, [isOpen, demande]);

  useEffect(() => {
    if (!isOpen) return;
    const loadServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch {
        setServices([]);
      }
    };
    loadServices();
  }, [isOpen]);

  if (!isOpen || !demande) return null;

  const resetForm = () => {
    setTitre(demande.titre || '');
    setDescription(demande.description || '');
    setServiceId(demande.service_id ? String(demande.service_id) : '');
    setFile(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('description', description);
      if (serviceId) {
        formData.append('service_id', serviceId);
      }
      if (file) {
        formData.append('fichier_joint', file);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/demandes/${demande.id}?_method=PUT`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess(response.data.message || 'Demande mise a jour avec succes');

      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise a jour de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900">Modifier la Demande</h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-500 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex gap-3 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-medium border border-green-100">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Titre de la demande</label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Description detaillee</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all font-medium resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all font-medium appearance-none"
            >
              <option value="">Choisir un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Fichier joint (optionnel)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all font-medium"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg">
              Annuler
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-amber-200 px-4 py-2 font-semibold text-amber-700 hover:bg-amber-50"
            >
              Effacer
            </button>
            <button type="submit" disabled={loading || success} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemandeEditModal;
