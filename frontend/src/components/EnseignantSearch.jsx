import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const EnseignantSearch = () => {
  const [niveauEnseigne, setNiveauEnseigne] = useState('');
  const [moduleEnseigne, setModuleEnseigne] = useState('');
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEnseignants = async (nextFilters = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/enseignants/search`, {
        params: {
          niveau_enseigne: nextFilters.niveau_enseigne ?? niveauEnseigne,
          module_enseigne: nextFilters.module_enseigne ?? moduleEnseigne,
        },
      });
      const data = res.data || [];
      setItems(data);

      const niveauSet = new Set();
      const moduleSet = new Set();
      data.forEach((item) => {
        if (item?.niveau_enseigne) {
          niveauSet.add(item.niveau_enseigne);
        }
        if (item?.module_enseigne) {
          moduleSet.add(item.module_enseigne);
        }
      });
      if (niveauSet.size) {
        setNiveauOptions(Array.from(niveauSet).sort());
      }
      if (moduleSet.size) {
        setModuleOptions(Array.from(moduleSet).sort());
      }
    } catch (err) {
      setItems([]);
      setError('Impossible de charger les enseignants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnseignants({ niveau_enseigne: niveauEnseigne, module_enseigne: moduleEnseigne });
  }, [niveauEnseigne, moduleEnseigne]);

  const rows = useMemo(() => items || [], [items]);

  return (
    <div className="card-minimal p-6 space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
          Niveau enseigne
          <select
            value={niveauEnseigne}
            onChange={(e) => setNiveauEnseigne(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
          >
            <option value="">Tous</option>
            {niveauOptions.map((opt) => (
              <option key={`niveau-${opt}`} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
          Module enseigne
          <select
            value={moduleEnseigne}
            onChange={(e) => setModuleEnseigne(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
          >
            <option value="">Tous</option>
            {moduleOptions.map((opt) => (
              <option key={`module-${opt}`} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="card-minimal p-0 overflow-hidden border border-slate-100">
        <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 font-display">Resultats enseignants</h3>
            <p className="text-xs text-slate-500">Filtre par niveau et module enseignes.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
            {rows.length} Resultats
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Heures automne</th>
                <th className="px-4 py-3">Heures printemps</th>
                <th className="px-4 py-3">Heures total</th>
                <th className="px-4 py-3">Date retraite</th>
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
              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{row.nom || '-'}</td>
                  <td className="px-4 py-3">{row.heures_automne ?? '-'}</td>
                  <td className="px-4 py-3">{row.heures_printemps ?? '-'}</td>
                  <td className="px-4 py-3">{row.heures_total ?? '-'}</td>
                  <td className="px-4 py-3">{row.date_retraite || '-'}</td>
                </tr>
              ))}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                    Aucun resultat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnseignantSearch;
