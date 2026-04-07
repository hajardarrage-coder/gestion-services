import React, { useMemo, useState } from 'react';
import SearchFilters from '../search/SearchFilters';

const PERSONNEL_TABS = [
  { key: 'infos_personnelles', label: 'Infos personnelles' },
  { key: 'infos_pro', label: 'Infos pro' },
  { key: 'enseignement', label: 'Enseignement' },
  { key: 'statistiques', label: 'Statistiques' },
];

const PERSONNEL_FILTERS = [
  { key: 'nom', label: 'Nom' },
  { key: 'prenom', label: 'Prenom' },
  { key: 'cin', label: 'CIN' },
  { key: 'ppr', label: 'PPR' },
  { key: 'type_personnel', label: 'Type personnel' },
  { key: 'grade', label: 'Grade' },
  { key: 'departement', label: 'Departement' },
  { key: 'date_recrutement', label: 'Date recrutement' },
  { key: 'age', label: 'Age (ex: >=40)' },
  { key: 'statut_retraite', label: 'Statut retraite' },
  { key: 'module', label: 'Module' },
  { key: 'niveau', label: 'Niveau' },
  { key: 'semestre', label: 'Semestre' },
];

const normalizeType = (value) => {
  const raw = String(value || '').toLowerCase();
  if (raw.includes('prof')) return 'prof';
  if (raw.includes('admin')) return 'admin';
  return raw;
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value) => {
  const parsed = parseDate(value);
  return parsed ? parsed.toLocaleDateString('fr-FR') : '-';
};

const uniqueValues = (values) =>
  Array.from(
    new Set(
      values
        .map((value) => (value === null || value === undefined ? '' : String(value).trim()))
        .filter((value) => value !== '')
    )
  ).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

const badgeClassByType = (type) =>
  normalizeType(type) === 'prof'
    ? 'bg-blue-50 text-blue-700 border-blue-100'
    : 'bg-slate-100 text-slate-600 border-slate-200';

const statusBadgeClass = (status) =>
  String(status || '').toLowerCase().includes('proche')
    ? 'bg-red-50 text-red-700 border-red-100'
    : 'bg-emerald-50 text-emerald-700 border-emerald-100';

const PersonnelModule = ({ items = [], loading = false, search, setSearch, filters, setFilters }) => {
  const [activeSection, setActiveSection] = useState('infos_personnelles');

  const normalizedItems = useMemo(
    () =>
      (items || []).map((item) => ({
        ...item,
        nom_complet: item.nom_complet || `${item.nom || ''} ${item.prenom || ''}`.trim() || '-',
        type_personnel_normalized: normalizeType(item.type_personnel || item.type),
        type_label: item.type || item.type_personnel || item.type_personnel_normalized || '-',
        statut_retraite: item.statut_retraite || 'Actif',
        teaching_assignments: Array.isArray(item.teaching_assignments) ? item.teaching_assignments : [],
      })),
    [items]
  );

  const valueOptions = useMemo(
    () => ({
      nom: uniqueValues(normalizedItems.map((item) => item.nom)),
      prenom: uniqueValues(normalizedItems.map((item) => item.prenom)),
      cin: uniqueValues(normalizedItems.map((item) => item.cin)),
      ppr: uniqueValues(normalizedItems.map((item) => item.ppr)),
      type_personnel: ['prof', 'admin'],
      grade: uniqueValues(normalizedItems.map((item) => item.grade || item.role)),
      departement: uniqueValues(normalizedItems.map((item) => item.departement || item.department)),
      date_recrutement: uniqueValues(normalizedItems.map((item) => item.dates?.date_recrutement || item.recruitment_year)),
      age: [],
      statut_retraite: ['Actif', 'Retraite proche'],
      module: uniqueValues(
        normalizedItems.flatMap((item) => item.teaching_assignments.map((assignment) => assignment.module))
      ),
      niveau: uniqueValues(
        normalizedItems.flatMap((item) => item.teaching_assignments.map((assignment) => assignment.niveau))
      ),
      semestre: ['automne', 'printemps'],
    }),
    [normalizedItems]
  );

  const teachingRows = useMemo(
    () =>
      normalizedItems.flatMap((item) => {
        const totalHeures = Number(item.heures_annuelle || 0);
        if (!item.teaching_assignments.length) {
          return [
            {
              personnelId: item.id,
              nomComplet: item.nom_complet,
              type: item.type_label,
              module: '-',
              niveau: '-',
              semestre: '-',
              heuresSemaine: '-',
              heuresSemestre: '-',
              totalHeures,
            },
          ];
        }

        return item.teaching_assignments.map((assignment) => ({
          personnelId: item.id,
          nomComplet: item.nom_complet,
          type: item.type_label,
          module: assignment.module || '-',
          niveau: assignment.niveau || '-',
          semestre: assignment.semestre || '-',
          heuresSemaine: assignment.heures_semaine ?? '-',
          heuresSemestre: assignment.heures_semestre ?? '-',
          totalHeures,
        }));
      }),
    [normalizedItems]
  );

  const stats = useMemo(() => {
    const profCount = normalizedItems.filter((item) => item.type_personnel_normalized === 'prof').length;
    const adminCount = normalizedItems.filter((item) => item.type_personnel_normalized === 'admin').length;
    const retraiteProcheCount = normalizedItems.filter((item) => item.statut_retraite === 'Retraite proche').length;
    const totalAnnualHours = normalizedItems.reduce((total, item) => total + Number(item.heures_annuelle || 0), 0);
    const ages = normalizedItems.map((item) => Number(item.age)).filter((age) => Number.isFinite(age));
    const ageMoyen = ages.length ? (ages.reduce((sum, age) => sum + age, 0) / ages.length).toFixed(1) : '-';

    return {
      total: normalizedItems.length,
      profCount,
      adminCount,
      retraiteProcheCount,
      totalAnnualHours,
      ageMoyen,
    };
  }, [normalizedItems]);

  return (
    <div className="card-minimal p-0! overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/40 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {PERSONNEL_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSection(tab.key)}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                activeSection === tab.key
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <SearchFilters
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          filterOptions={PERSONNEL_FILTERS}
          valueOptions={valueOptions}
          placeholder="Rechercher nom, prenom, CIN, PPR..."
        />

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {loading ? '...' : `${normalizedItems.length} Elements`}
        </p>
      </div>

      {activeSection === 'statistiques' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          <div className="card-minimal border-l-4 border-slate-900">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total personnel</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="card-minimal border-l-4 border-blue-500">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Professeurs</p>
            <p className="text-2xl font-black text-slate-900">{stats.profCount}</p>
          </div>
          <div className="card-minimal border-l-4 border-slate-400">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Administratifs</p>
            <p className="text-2xl font-black text-slate-900">{stats.adminCount}</p>
          </div>
          <div className="card-minimal border-l-4 border-red-500">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Retraite proche</p>
            <p className="text-2xl font-black text-slate-900">{stats.retraiteProcheCount}</p>
          </div>
          <div className="card-minimal border-l-4 border-amber-500">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2">Age moyen</p>
            <p className="text-2xl font-black text-slate-900">{stats.ageMoyen}</p>
          </div>
          <div className="card-minimal border-l-4 border-emerald-500">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">Total heures annuelles</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalAnnualHours.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {activeSection === 'infos_personnelles' && (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-2">Nom complet</th>
                  <th className="px-6 py-2">Type</th>
                  <th className="px-6 py-2">Departement</th>
                  <th className="px-6 py-2">Age</th>
                  <th className="px-6 py-2">Date retraite</th>
                  <th className="px-6 py-2">Statut</th>
                  <th className="px-6 py-2">PPR</th>
                  <th className="px-6 py-2">CIN</th>
                  <th className="px-6 py-2">Sexe</th>
                  <th className="px-6 py-2">Naissance</th>
                  <th className="px-6 py-2">Lieu naissance</th>
                  <th className="px-6 py-2">Nationalite</th>
                </tr>
              </thead>
              <tbody>
                {normalizedItems.map((item) => (
                  <tr key={item.id} className="bg-white/80 border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    <td className="px-6 py-6 font-semibold text-slate-800">{item.nom_complet}</td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${badgeClassByType(item.type_personnel_normalized || item.type_personnel || item.type)}`}>
                        {item.type_label}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-slate-600">{item.departement || item.department || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.age ?? '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{formatDate(item.date_retraite)}</td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusBadgeClass(item.statut_retraite)}`}>
                        {item.statut_retraite}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-slate-600">{item.ppr || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.cin || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.sexe || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{formatDate(item.date_naissance)}</td>
                    <td className="px-6 py-6 text-slate-600">{item.lieu_naissance || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.nationalite || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSection === 'infos_pro' && (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-2">Nom complet</th>
                  <th className="px-6 py-2">Type</th>
                  <th className="px-6 py-2">Grade</th>
                  <th className="px-6 py-2">Specialite</th>
                  <th className="px-6 py-2">Departement</th>
                  <th className="px-6 py-2">Date recrutement</th>
                  <th className="px-6 py-2">Affectation MESRSF</th>
                  <th className="px-6 py-2">Affectation ENS</th>
                  <th className="px-6 py-2">Diplome</th>
                  <th className="px-6 py-2">Autres diplomes</th>
                  <th className="px-6 py-2">Handicap</th>
                </tr>
              </thead>
              <tbody>
                {normalizedItems.map((item) => (
                  <tr key={item.id} className="bg-white/80 border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    <td className="px-6 py-6 font-semibold text-slate-800">{item.nom_complet}</td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${badgeClassByType(item.type_personnel_normalized || item.type_personnel || item.type)}`}>
                        {item.type_label}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-slate-600">{item.grade || item.role || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.specialite || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.departement || item.department || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{formatDate(item.dates?.date_recrutement || item.recruitment_year)}</td>
                    <td className="px-6 py-6 text-slate-600">{formatDate(item.date_affectation_mesrsf)}</td>
                    <td className="px-6 py-6 text-slate-600">{formatDate(item.date_affectation_ens)}</td>
                    <td className="px-6 py-6 text-slate-600">{item.diplome || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">{item.autres_diplomes || '-'}</td>
                    <td className="px-6 py-6 text-slate-600">
                      {item.situation_handicap ? `Oui${item.type_handicap ? ` (${item.type_handicap})` : ''}` : 'Non'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSection === 'enseignement' && (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-2">Nom complet</th>
                  <th className="px-6 py-2">Type</th>
                  <th className="px-6 py-2">Module</th>
                  <th className="px-6 py-2">Niveau</th>
                  <th className="px-6 py-2">Semestre</th>
                  <th className="px-6 py-2">Heures semaine</th>
                  <th className="px-6 py-2">Heures semestre</th>
                  <th className="px-6 py-2">Total heures</th>
                </tr>
              </thead>
              <tbody>
                {teachingRows.map((row, index) => (
                  <tr key={`${row.personnelId}-${index}`} className="bg-white/80 border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    <td className="px-6 py-6 font-semibold text-slate-800">{row.nomComplet}</td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${badgeClassByType(row.type)}`}>
                        {row.type || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-slate-600">{row.module}</td>
                    <td className="px-6 py-6 text-slate-600">{row.niveau}</td>
                    <td className="px-6 py-6 text-slate-600">{row.semestre}</td>
                    <td className="px-6 py-6 text-slate-600">{row.heuresSemaine}</td>
                    <td className="px-6 py-6 text-slate-600">{row.heuresSemestre}</td>
                    <td className="px-6 py-6 text-slate-600">{row.totalHeures.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonnelModule;
