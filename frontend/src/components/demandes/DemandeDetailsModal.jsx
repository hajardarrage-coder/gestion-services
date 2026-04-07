import React, { useEffect, useState } from 'react';
import { X, Clock, AlertCircle, MessageSquare, Info, Download, Upload, Trash2, CheckCircle, Circle } from 'lucide-react';
import { downloadProtectedFile } from '../../utils/downloadFile';
import axios from 'axios';

const statusStyles = {
  envoye_admin: 'bg-amber-100 text-amber-700 border-amber-200',
  envoye_service: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  reponse_service: 'bg-blue-100 text-blue-700 border-blue-200',
  valide_admin: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  processed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  approuve: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejete: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels = {
  envoye_admin: 'En attente',
  envoye_service: 'En cours',
  reponse_service: 'En cours',
  processed: 'Traite',
  valide_admin: 'Termine',
  approuve: 'Termine',
  rejete: 'Termine',
};

const downloadButtonClass = 'inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all';

const DemandeDetailsModal = ({ isOpen, onClose, demande, showDecisionActions = false, onApprove, onReject, canManageFiles = false, onRefresh }) => {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [fileMessage, setFileMessage] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !demande?.id) return;
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/demandes/${demande.id}/history`);
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, [isOpen, demande?.id]);

  useEffect(() => {
    if (!isOpen) {
      setFileMessage(null);
      setFileLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !demande) return null;

  const handleDownload = async (url, filename) => {
    try {
      await downloadProtectedFile(url, filename);
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Erreur lors du telechargement du fichier');
    }
  };

  const handleReplaceFile = async (type, file) => {
    if (!file || !demande?.id) return;
    setFileLoading(true);
    setFileMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${import.meta.env.VITE_API_URL}/demandes/${demande.id}/files/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileMessage({ type: 'success', text: 'Fichier mis a jour avec succes.' });
      onRefresh?.();
    } catch (error) {
      setFileMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise a jour du fichier.' });
    } finally {
      setFileLoading(false);
    }
  };

  const handleDeleteFile = async (type) => {
    if (!demande?.id) return;
    if (!window.confirm('Supprimer ce fichier ?')) return;
    setFileLoading(true);
    setFileMessage(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/demandes/${demande.id}/files/${type}`);
      setFileMessage({ type: 'success', text: 'Fichier supprime.' });
      onRefresh?.();
    } catch (error) {
      setFileMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la suppression du fichier.' });
    } finally {
      setFileLoading(false);
    }
  };

  const canDecide = showDecisionActions && (demande.statut === 'processed' || demande.statut === 'valide_admin');
  const progressMap = {
    envoye_admin: 1,
    envoye_service: 2,
    reponse_service: 3,
    processed: 4,
    valide_admin: 5,
    approuve: 5,
    rejete: 5,
  };
  const progress = progressMap[demande.statut] || 1;
  const timelineSteps = [
    { key: 'created', label: 'Demande creee', step: 1 },
    { key: 'assigned', label: 'Assignee au service', step: 2 },
    { key: 'uploaded', label: 'Fichier charge', step: 3 },
    { key: 'processed', label: 'Fichier traite', step: 4 },
    { key: 'sent', label: 'Envoyee au president', step: 5 },
  ];
  const fileItems = [
    { type: 'request', label: 'Fichier demande', url: demande.request_file_url, name: demande.request_file_name },
    { type: 'service', label: 'Fichier service', url: demande.service_file_url, name: demande.service_file_name },
    { type: 'admin', label: 'Fichier admin', url: demande.admin_file_url, name: demande.admin_file_name },
    { type: 'final', label: 'Dataset final', url: demande.final_dataset_url, name: demande.final_dataset_name },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/40">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Details de la Demande</h3>
            <p className="text-slate-400 text-sm font-bold mt-1">Reference: {demande.reference ? demande.reference : `#D-${demande.id}`}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-slate-400 border border-transparent hover:border-slate-100">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusStyles[demande.statut] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              Statut: {statusLabels[demande.statut] || demande.statut}
            </span>
            <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-900">
              Priorite: {demande.priorite || 'Moyenne'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} className="text-primary-500" />
                  Titre
                </label>
                <p className="text-lg font-black text-slate-900 leading-tight uppercase">{demande.titre}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} className="text-primary-500" />
                  Type de donnees
                </label>
                <p className="font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl w-fit">{demande.type_donnees}</p>
              </div>

              {demande.niveau_etude && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau d'etude</label>
                  <p className="font-bold text-slate-700">{demande.niveau_etude}</p>
                </div>
              )}

              {demande.type_personnel && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de personnel</label>
                  <p className="font-bold text-slate-700">{demande.type_personnel}</p>
                </div>
              )}

              {demande.service?.name && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service assigne</label>
                  <p className="font-bold text-slate-700">{demande.service.name}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} className="text-primary-500" />
                  Date de creation
                </label>
                <p className="font-bold text-slate-700">{new Date(demande.created_at).toLocaleString('fr-FR')}</p>
              </div>

              {demande.service_file_url && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fichier service</label>
                  <button type="button" onClick={() => handleDownload(demande.service_file_url, demande.service_file_name)} className={downloadButtonClass}>
                    <Download size={14} />
                    {demande.service_file_name || 'Telecharger'}
                  </button>
                </div>
              )}

              {demande.request_file_url && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fichier demande</label>
                  <button type="button" onClick={() => handleDownload(demande.request_file_url, demande.request_file_name)} className={downloadButtonClass}>
                    <Download size={14} />
                    {demande.request_file_name || 'Telecharger'}
                  </button>
                </div>
              )}

              {demande.admin_file_url && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fichier admin</label>
                  <button type="button" onClick={() => handleDownload(demande.admin_file_url, demande.admin_file_name)} className={downloadButtonClass}>
                    <Download size={14} />
                    {demande.admin_file_name || 'Telecharger'}
                  </button>
                </div>
              )}

              {demande.final_dataset_url && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dataset final</label>
                  <button type="button" onClick={() => handleDownload(demande.final_dataset_url, demande.final_dataset_name)} className={downloadButtonClass}>
                    <Download size={14} />
                    {demande.final_dataset_name || 'Telecharger'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} className="text-primary-500" />
              Description
            </label>
            <p className="text-slate-600 font-medium leading-relaxed">{demande.description}</p>
          </div>

          <div className="space-y-3 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-primary-500" />
              Timeline
            </label>
            <ul className="space-y-2">
              {timelineSteps.map((step) => {
                const done = progress >= step.step;
                return (
                  <li key={step.key} className="flex items-center gap-3 text-xs">
                    {done ? (
                      <CheckCircle size={14} className="text-emerald-500" />
                    ) : (
                      <Circle size={12} className="text-slate-300" />
                    )}
                    <span className={done ? 'text-slate-700 font-semibold' : 'text-slate-400'}>{step.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {canManageFiles && (
            <div className="space-y-4 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Upload size={14} className="text-primary-500" />
                Gestion des fichiers
              </label>
              {fileMessage && (
                <div className={`text-xs font-bold px-4 py-2 rounded-xl ${fileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {fileMessage.text}
                </div>
              )}
              <div className="space-y-4">
                {fileItems.map((item) => (
                  <div key={item.type} className="flex flex-wrap items-center justify-between gap-3 bg-white/80 border border-slate-100 rounded-2xl px-4 py-3">
                    <div className="min-w-[180px]">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-700">{item.name || 'Aucun fichier'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.url && (
                        <button type="button" onClick={() => handleDownload(item.url, item.name)} className={downloadButtonClass}>
                          <Download size={14} />
                          Telecharger
                        </button>
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer">
                        <Upload size={14} />
                        Remplacer
                        <input
                          type="file"
                          className="hidden"
                          disabled={fileLoading}
                          onChange={(event) => handleReplaceFile(item.type, event.target.files?.[0])}
                        />
                      </label>
                      {item.url && (
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(item.type)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {fileLoading && <p className="text-xs text-slate-400">Chargement...</p>}
            </div>
          )}

          {demande.commentaire && (
            <div className="space-y-3 bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1 rounded-full border border-white/10 w-fit">
                Commentaire service / admin
              </span>
              <p className="relative z-10 text-lg font-medium leading-relaxed italic">"{demande.commentaire}"</p>
            </div>
          )}

          <div className="space-y-3 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-primary-500" />
              Historique de la demande
            </label>
            {historyLoading && <p className="text-xs text-slate-400">Chargement...</p>}
            {!historyLoading && history.length === 0 && (
              <p className="text-xs text-slate-400">Aucune activite enregistree.</p>
            )}
            {!historyLoading && history.length > 0 && (
              <ul className="space-y-2 text-xs text-slate-600">
                {history.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-700">{item.description || item.action}</span>
                    <span className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleString('fr-FR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!demande.service_file_url && demande.statut !== 'envoye_admin' && (
            <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-100 flex items-center gap-5">
              <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-amber-900 font-black tracking-tight uppercase text-sm">En cours de traitement</p>
                <p className="text-amber-700/70 text-xs font-bold">Le service a recu votre demande et prepare le retour.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
          {canDecide ? (
            <>
              <button
                onClick={onReject}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Rejeter
              </button>
              <button
                onClick={onApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Approuver
              </button>
              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailsModal;
