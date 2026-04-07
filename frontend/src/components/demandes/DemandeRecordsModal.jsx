import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, AlertCircle } from 'lucide-react';

const DemandeRecordsModal = ({ isOpen, onClose, demandeId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !demandeId) return;

    const loadRecords = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/demandes/${demandeId}/records`);
        setRecords(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des donnees');
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [isOpen, demandeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900">Donnees extraites</h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-500 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Chargement...</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune donnee extraite.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prenom</th>
                    <th className="px-4 py-2">CIN</th>
                    <th className="px-4 py-2">Filiere</th>
                    <th className="px-4 py-2">Niveau</th>
                    <th className="px-4 py-2">Bac</th>
                    <th className="px-4 py-2">Province</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="bg-white border border-slate-100 rounded-2xl">
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">{record.code}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.nom}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.prenom}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.cin || '-'}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.filiere}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.niveau}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.bac}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.province}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandeRecordsModal;
