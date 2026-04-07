import React, { useState, useEffect, useMemo } from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { 
  Users2, ShieldCheck, RefreshCcw, AlertTriangle, 
  LayoutDashboard, Bell, Search, Filter, 
  ChevronRight, Printer, Edit3, Trash2, RotateCcw 
} from 'lucide-react';

const DEFAULT_PAGINATION = { current_page: 1, last_page: 1, per_page: 20, total: 0 };

const SkeletonBar = ({ className = '' }) => (
  <div className={`animate-pulse rounded-full bg-slate-200/70 ${className}`} />
);

const SEARCHABLE_FIELDS = (t) => [
  { key: 'nom_prenom', label: t('nom_prenom') },
  { key: 'ppr', label: 'PPR' },
  { key: 'code_grade', label: 'Grade' },
  { key: 'code_annee', label: t('school_year') },
  { key: 'type_personnel', label: 'Type personnel (Enseignant / Administratif)' },
  { key: 'service_affectation', label: t('service') },
  { key: 'date_retraite', label: t('retirement_status') },
];

const safe = (value) => {
  if (value === null || value === undefined) return '-';
  const text = String(value).trim();
  return text === '' ? '-' : text;
};

const badgeTone = (status) => {
  if ((status || '').toLowerCase() === 'retraite') return 'bg-slate-900 text-white';
  if ((status || '').toLowerCase() === 'proche') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const toneStyles = {
  indigo: { chip: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-500' },
  emerald: { chip: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
  slate: { chip: 'bg-slate-50 text-slate-600', bar: 'bg-slate-600' },
  amber: { chip: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500' },
};

const PersonnelDashboardSection = ({
  items = [],
  loading = false,
  search,
  setSearch,
  filters = [],
  setFilters = () => {},
  pagination = DEFAULT_PAGINATION,
  onPreviousPage,
  onNextPage,
  onSearch,
  showDeleted = false,
  setShowDeleted = null,
  onSoftDelete = null,
  onRestore = null,
  onForceDelete = null,
  onEdit = null,
  onPrint = null,
  sort = 'asc',
  setSort = () => {},
  onBulkDelete = null,
  bulkDeleteDisabled = true,
  selectable = false,
  allSelected = false,
  onToggleSelectAll = () => {},
  selectedIds = [],
  onToggleSelect = () => {},
  typeFilter = '',
  setTypeFilter = () => {},
  hideToolbar = false,
  showLabels = true,
}) => {
  const { t } = usePreferences();
  const [selectedField, setSelectedField] = useState('nom_prenom');
  const skeletonRows = useMemo(() => Array.from({ length: Math.min(6, pagination?.per_page || 6) }), [pagination?.per_page]);
  const isEmpty = !loading && items.length === 0;

  const currentPage = Number(pagination?.current_page) || 1;
  const lastPage = Math.max(1, Number(pagination?.last_page) || 1);
  const totalItems = Number.isFinite(Number(pagination?.total)) ? Number(pagination.total) : items.length;
  const canGoPreviousPage = currentPage > 1 && typeof onPreviousPage === 'function';
  const canGoNextPage = currentPage < lastPage && typeof onNextPage === 'function';
  const hasDeleteActions =
    typeof onSoftDelete === 'function'
    || typeof onRestore === 'function'
    || typeof onForceDelete === 'function';
  const hasActions = hasDeleteActions || typeof onEdit === 'function' || typeof onPrint === 'function' || selectable;
  const baseColumnCount = 23;
  const totalColumns = baseColumnCount + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  const stats = useMemo(() => {
    const total = items.length;
    const retired = items.filter((p) => (p.retirement_status || '').toLowerCase() === 'retraite').length;
    const nearRetire = items.filter((p) => (p.retirement_status || '').toLowerCase() === 'proche').length;
    const active = total - retired;
    return [
      { label: 'Total personnels', value: total, icon: Users2, tone: 'indigo' },
      { label: 'Actifs', value: active, icon: ShieldCheck, tone: 'emerald' },
      { label: 'Retraites', value: retired, icon: RefreshCcw, tone: 'slate' },
      { label: 'Departs proches', value: nearRetire, icon: AlertTriangle, tone: 'amber' },
    ];
  }, [items]);

  useEffect(() => {
    setSearch('');
  }, [selectedField, setSearch]);

  useEffect(() => {
    // Keep filters synced with the selected field + search value (single-target search)
    const trimmed = String(search || '').trim();
    if (!trimmed) {
      setFilters([]);
      return;
    }
    if (selectedField === 'nom_prenom') {
      setFilters([
        { field: 'nom', value: trimmed },
        { field: 'prenom', value: trimmed },
      ]);
    } else {
      setFilters([{ field: selectedField, value: trimmed }]);
    }
  }, [search, selectedField, setFilters]);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-12 lg:max-w-7xl">
        {/* Top bar */}
        <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-slate-200/70 bg-white/80 px-4 pb-3 pt-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
                <LayoutDashboard size={20} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t('dashboard')}</p>
                <h1 className="text-2xl font-bold text-slate-900">{t('personnel')}</h1>
                <p className="text-sm text-slate-500">Vue claire a comprendre en moins de 5 secondes.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
                {loading ? t('loading') : `${totalItems} ${t('results_found')}`}
              </span>
              {typeof onSearch === 'function' && (
                <button
                  type="button"
                  onClick={onSearch}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                >
                  <RefreshCcw size={14} /> {t('refresh')}
                </button>
              )}
              {typeof setShowDeleted === 'function' && (
                <button
                  type="button"
                  onClick={() => setShowDeleted(!showDeleted)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${
                    showDeleted
                      ? 'border border-amber-300 bg-amber-50 text-amber-700'
                      : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Bell size={14} /> {showDeleted ? t('archived_records') : t('active_records')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? skeletonRows.slice(0, 4).map((_, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 shadow-sm">
                <SkeletonBar className="h-3 w-24" />
                <SkeletonBar className="mt-3 h-8 w-20" />
                <SkeletonBar className="mt-3 h-2 w-full" />
              </div>
            ))
            : stats.map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles[tone].chip} ring-1 ring-slate-100`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-2 text-3xl font-black text-slate-900">{value}</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${toneStyles[tone].bar}`}
                    style={{ width: `${Math.min(100, (value / Math.max(1, totalItems)) * 100)}%` }}
                  />
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-10 -translate-y-10 rounded-full bg-linear-to-br from-slate-200/40 via-transparent to-transparent" />
              </div>
            ))}
        </div>

        {/* Filters */}
        {!hideToolbar && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-md shadow-slate-200/70">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 shadow-inner">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Search size={16} />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Recherche rapide</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && typeof onSearch === 'function') {
                        onSearch();
                      }
                    }}
                    placeholder={`Par ${SEARCHABLE_FIELDS(t).find((field) => field.key === selectedField)?.label || ''}...`}
                    className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 shadow-inner">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                  <Filter size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Champ</label>
                  <select
                    value={selectedField}
                    onChange={(event) => setSelectedField(event.target.value)}
                    className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {SEARCHABLE_FIELDS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 shadow-inner">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                  <ChevronRight size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Trier</label>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="desc">Plus recent</option>
                    <option value="asc">Plus ancien</option>
                    <option value="nom_asc">Nom A-Z</option>
                    <option value="nom_desc">Nom Z-A</option>
                    <option value="retraite">Retraite proche</option>
                    <option value="recrut_rec">Recrutement recent</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 shadow-inner">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                  <Users2 size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Tous</option>
                    <option value="Enseignant">Enseignant</option>
                    <option value="Administratif">Administratif</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">{t('active')}</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-700">{t('near_retirement')}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">{t('retired')}</span>
              </div>
              <span className="font-semibold">
                {loading ? t('loading') : `${totalItems} ${t('results_found')} - Page ${currentPage}/${lastPage}`}
              </span>
            </div>

            {typeof onBulkDelete === 'function' && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p className="font-semibold">Suppression groupee</p>
                <button
                  type="button"
                  onClick={() => {
                    if (bulkDeleteDisabled) {
                      window.alert('Selectionnez au moins un personnel avant de supprimer.');
                      return;
                    }
                    onBulkDelete();
                  }}
                  className={`rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 ${
                    bulkDeleteDisabled
                      ? 'bg-white text-red-300 shadow-sm'
                      : 'bg-red-500 text-white shadow-sm hover:bg-red-600'
                  }`}
                  title="Supprimer uniquement les elements selectionnes"
                >
                  Supprimer selection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:block">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{t('list_detailed')}</p>
              <h2 className="text-lg font-semibold text-slate-900">{t('quick_actions')}</h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{t('active')}</span>
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700">{t('near_retirement')}</span>
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-700">{t('retired')}</span>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm" aria-hidden>
                <div className="flex h-full items-center justify-center gap-3 text-sm font-semibold text-slate-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-500" />
                  Mise a jour des donnees...
                </div>
              </div>
            )}
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50/95 text-[10px] uppercase tracking-wide text-slate-600 backdrop-blur">
                <tr>
                  {selectable && (
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={onToggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-slate-700"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3">Etablissement</th>
                  <th className="px-4 py-3">Annee Univ.</th>
                  <th className="px-4 py-3">PPR</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Prenom</th>
                  <th className="px-4 py-3">Genre</th>
                  <th className="px-4 py-3">Date naissance</th>
                  <th className="px-4 py-3">Lieu naissance</th>
                  <th className="px-4 py-3">Nationalite</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Type personnel</th>
                  <th className="px-4 py-3">Date recrutement</th>
                  <th className="px-4 py-3">Affectation MESRSFC</th>
                  <th className="px-4 py-3">Infos specifiques</th>
                  <th className="px-4 py-3">Nombre diplome</th>
                  <th className="px-4 py-3">Diplome</th>
                  <th className="px-4 py-3">Specialite</th>
                  <th className="px-4 py-3">Handicap</th>
                  <th className="px-4 py-3">Universite / etab.</th>
                  <th className="px-4 py-3">Autres diplomes</th>
                  <th className="px-4 py-3">Situation admin.</th>
                  <th className="px-4 py-3">Date retraite</th>
                  <th className="px-4 py-3">Statut retraite</th>
                  {hasActions && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading &&
                  skeletonRows.map((_, index) => (
                    <tr key={`s-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      {selectable && <td className="px-4 py-3"><SkeletonBar className="h-4 w-4" /></td>}
                      <td className="px-4 py-3"><SkeletonBar className="h-4 w-28" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-16" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-14" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-28" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-32" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-16" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-16" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-14" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-28" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-20" /></td>
                      <td className="px-4 py-3"><SkeletonBar className="h-3 w-24" /></td>
                      {hasActions && (
                        <td className="px-4 py-3 text-right">
                          <SkeletonBar className="ml-auto h-8 w-20" />
                        </td>
                      )}
                    </tr>
                  ))}

                {!loading && items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/40`}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => onToggleSelect(item.id)}
                          className="h-4 w-4 rounded border-slate-300 text-slate-700"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {showLabels ? safe(item.etablissement || item.code_etablissement) : safe(item.code_etablissement)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                        {safe(item.code_annee || item.annee_scolaire)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{safe(item.ppr)}</td>
                    <td className="px-4 py-3">{safe(item.nom)}</td>
                    <td className="px-4 py-3">{safe(item.prenom)}</td>
                    <td className="px-4 py-3">{safe(item.genre || item.sexe)}</td>
                    <td className="px-4 py-3">{safe(item.date_naissance)}</td>
                    <td className="px-4 py-3">{safe(item.lieu_naissance)}</td>
                    <td className="px-4 py-3">
                      {showLabels ? safe(item.nationalite || item.code_nationalite) : safe(item.code_nationalite)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {showLabels ? safe(item.grade || item.code_grade) : safe(item.code_grade)}
                    </td>
                    <td className="px-4 py-3">{safe(item.type_personnel || item.type)}</td>
                    <td className="px-4 py-3">{safe(item.date_recrutement)}</td>
                    <td className="px-4 py-3">{safe(item.date_affectation_mesrsfc || item.date_affectation_MESRSFC)}</td>
                    <td className="px-4 py-3">
                      {(() => {
                        const type = String(item.type_personnel || item.type || '').toLowerCase();
                        if (type === 'administratif') {
                          return (
                            <div className="flex flex-col gap-1 text-xs text-slate-600">
                              <span className="font-semibold text-slate-700">Fonction: {safe(item.fonction_exercee)}</span>
                              <span className="font-semibold text-slate-700">Service: {safe(item.service_affectation || item.departement)}</span>
                            </div>
                          );
                        }
                        if (type === 'enseignant') {
                          return (
                            <div className="flex flex-col gap-1 text-xs text-slate-600">
                              <span className="font-semibold text-slate-700">
                                Departement: {showLabels ? safe(item.departement || item.code_departement) : safe(item.code_departement)}
                              </span>
                              <span className="font-semibold text-slate-700">
                                Affectation: {safe(item.date_affectation_ens || item.date_affectation_enseignement)}
                              </span>
                            </div>
                          );
                        }
                        return <span className="text-xs text-slate-400">-</span>;
                      })()}
                    </td>
                    <td className="px-4 py-3">{safe(item.nombre_diplomes || item.nombre_de_diplome)}</td>
                    <td className="px-4 py-3">{safe(item.diplome)}</td>
                    <td className="px-4 py-3">{safe(item.specialite)}</td>
                    <td className="px-4 py-3">
                      {safe(
                        item.situation_handicap ?? item.situation_du_handicap
                          ? (item.type_handicap || 'Oui')
                          : 'Non'
                      )}
                    </td>
                    <td className="px-4 py-3">{safe(item.universite_diplomante || item.universite_etablissement_diplomante)}</td>
                    <td className="px-4 py-3">{safe(item.autres_diplomes)}</td>
                    <td className="px-4 py-3">{safe(item.situation_administrative)}</td>
                    <td className="px-4 py-3">{safe(item.date_retraite)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${badgeTone(item.retirement_status)}`}>
                        {safe(item.retirement_status === 'retraite'
                          ? 'Retraite'
                          : item.retirement_status === 'proche'
                            ? 'Retraite proche'
                            : 'Actif')}
                      </span>
                    </td>
                    {hasActions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {typeof onPrint === 'function' && (
                            <button
                              type="button"
                              onClick={() => onPrint(item)}
                              className="rounded-md border border-slate-200 p-2 text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                              title="Imprimer"
                            >
                              <Printer size={16} />
                            </button>
                          )}
                          {!showDeleted && typeof onEdit === 'function' && (
                            <button
                              type="button"
                              onClick={() => onEdit(item)}
                              className="rounded-md border border-slate-200 p-2 text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                              title="Modifier"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {!showDeleted && typeof onSoftDelete === 'function' && (
                            <button
                              type="button"
                              onClick={() => onSoftDelete(item)}
                              className="rounded-md border border-red-200 p-2 text-red-600 transition-colors duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          {showDeleted && typeof onRestore === 'function' && (
                            <button
                              type="button"
                              onClick={() => onRestore(item)}
                              className="rounded-md border border-emerald-200 p-2 text-emerald-600 transition-colors duration-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                              title="Restaurer"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                          {showDeleted && typeof onForceDelete === 'function' && (
                            <button
                              type="button"
                              onClick={() => onForceDelete(item)}
                              className="rounded-md border border-red-200 p-2 text-red-600 transition-colors duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                              title="Suppression definitive"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {isEmpty && (
                  <tr>
                    <td colSpan={totalColumns} className="px-6 py-10 text-center text-sm text-slate-400">
                      Aucun resultat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 md:hidden">
          {isEmpty && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
              Aucun resultat.
            </div>
          )}
          <div className="space-y-3">
            {loading &&
              skeletonRows.map((_, idx) => (
                <div key={`m-${idx}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <SkeletonBar className="h-4 w-32" />
                    <SkeletonBar className="h-5 w-16" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SkeletonBar className="h-3 w-full" />
                    <SkeletonBar className="h-3 w-full" />
                    <SkeletonBar className="h-3 w-full" />
                    <SkeletonBar className="h-3 w-full" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <SkeletonBar className="h-8 w-24" />
                    <SkeletonBar className="h-8 w-16" />
                  </div>
                </div>
              ))}

            {!loading && items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{safe(item.code_etablissement)}</p>
                    <h3 className="text-base font-semibold text-slate-900">
                      {safe(item.nom)} {safe(item.prenom)}
                    </h3>
                    <p className="text-xs text-slate-500">PPR: {safe(item.ppr)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${badgeTone(item.retirement_status)}`}>
                    {safe(item.retirement_status === 'retraite'
                      ? 'Retraite'
                      : item.retirement_status === 'proche'
                        ? 'Proche'
                        : 'Actif')}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-700">Type</p>
                    <p>{safe(item.type_personnel || item.type)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Grade</p>
                    <p>{showLabels ? safe(item.grade || item.code_grade) : safe(item.code_grade)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Recrutement</p>
                    <p>{safe(item.date_recrutement)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Retraite</p>
                    <p>{safe(item.date_retraite)}</p>
                  </div>
                </div>
                {hasActions && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {typeof onPrint === 'function' && (
                      <button
                        type="button"
                        onClick={() => onPrint(item)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                      >
                        Imprimer
                      </button>
                    )}
                    {!showDeleted && typeof onEdit === 'function' && (
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                      >
                        Modifier
                      </button>
                    )}
                    {!showDeleted && typeof onSoftDelete === 'function' && (
                      <button
                        type="button"
                        onClick={() => onSoftDelete(item)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                      >
                        Supprimer
                      </button>
                    )}
                    {showDeleted && typeof onRestore === 'function' && (
                      <button
                        type="button"
                        onClick={() => onRestore(item)}
                        className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors duration-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                      >
                        Restaurer
                      </button>
                    )}
                    {showDeleted && typeof onForceDelete === 'function' && (
                      <button
                        type="button"
                        onClick={() => onForceDelete(item)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                      >
                        Supp. def.
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {typeof onPreviousPage === 'function' && typeof onNextPage === 'function' && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {`Page ${currentPage}/${lastPage}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={!canGoPreviousPage || loading}
                className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Precedent
              </button>
              <button
                type="button"
                onClick={onNextPage}
                disabled={!canGoNextPage || loading}
                className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelDashboardSection;
