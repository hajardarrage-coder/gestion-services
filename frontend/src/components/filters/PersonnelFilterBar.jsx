import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';

const normalize = (value) => String(value || '').trim();
const normalizeKey = (value) =>
  normalize(value)
    .toLowerCase()
    .replace(/\s+/g, '_');

const FIELD_ALIASES = {
  type: 'type_personnel',
  type_personnel: 'type_personnel',
  nom: 'nom',
  prenom: 'prenom',
  grade: 'grade',
  code_grade: 'grade',
  lieu: 'lieu',
  lieu_naissance: 'lieu',
  departement: 'departement',
  department: 'departement',
  code_departement: 'departement',
};

const ALLOWED_FIELDS = new Set(['type_personnel', 'lieu', 'grade', 'nom', 'prenom', 'departement']);
const toCanonicalField = (key) => FIELD_ALIASES[normalizeKey(key)] || normalizeKey(key);

const uniqueSorted = (values = []) =>
  Array.from(new Set((values || []).map((value) => normalize(value)).filter((value) => value !== '')))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

const normalizeInputType = (type = '') => {
  const value = normalize(type).toLowerCase();
  if (['select', 'dropdown'].includes(value)) return 'select';
  if (['number', 'numeric'].includes(value)) return 'number';
  return 'text';
};

const toSelectOptions = (values = []) => uniqueSorted(values);

const buildPersonnelQuery = ({
  search = '',
  filters = [],
  basePath = '/api/personnel',
}) => {
  const params = new URLSearchParams();
  const normalizedSearch = normalize(search);
  if (normalizedSearch) params.set('search', normalizedSearch);

  (filters || []).forEach((item) => {
    const field = normalize(item?.field);
    const value = normalize(item?.value);
    if (!field || !value) return;
    params.append(field, value);
  });

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

const DEFAULT_FIELDS = [
  { key: 'type_personnel', label: 'Type personnel', inputType: 'select', options: ['Enseignant', 'Administratif'] },
  { key: 'nom', label: 'Nom', inputType: 'text', placeholder: 'Ex: Alaoui' },
  { key: 'prenom', label: 'Prenom', inputType: 'text', placeholder: 'Ex: Sara' },
  { key: 'lieu', label: 'Lieu', inputType: 'select' },
  { key: 'grade', label: 'Grade', inputType: 'select' },
  { key: 'departement', label: 'Departement', inputType: 'select' },
];

const PersonnelFilterBar = ({
  filters = [],
  setFilters = () => {},
  search = '',
  setSearch = () => {},
  setTypeFilter = () => {},
  onYearChange = () => {},
  gradeOptions = [],
  filterOptions = [],
  valueOptions = {},
  onApply = () => {},
  onReset = null,
  onQueryChange = null,
  queryBasePath = '/api/personnel',
}) => {
  const addMenuRef = useRef(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const fieldsCatalog = useMemo(() => {
    const byKey = new Map();
    const upsert = (field) => {
      const key = toCanonicalField(field?.key || field?.field);
      if (!key || !ALLOWED_FIELDS.has(key)) return;

      const existing = byKey.get(key);
      const nextOptions = toSelectOptions([
        ...(existing?.options || []),
        ...(field?.options || []),
      ]);

      const inferredInputType = field?.inputType
        || normalizeInputType(field?.type)
        || existing?.inputType
        || 'text';

      const inputType = nextOptions.length > 0 || inferredInputType === 'select'
        ? 'select'
        : inferredInputType;

      byKey.set(key, {
        key,
        label: field?.label || existing?.label || key,
        inputType,
        options: nextOptions,
        placeholder: field?.placeholder || existing?.placeholder || 'Valeur...',
      });
    };

    DEFAULT_FIELDS.forEach(upsert);
    (filterOptions || []).forEach(upsert);

    Object.entries(valueOptions || {}).forEach(([rawKey, rawOptions]) => {
      const key = toCanonicalField(rawKey);
      if (!ALLOWED_FIELDS.has(key)) return;

      const normalizedOptions = toSelectOptions(rawOptions);
      const field = byKey.get(key);
      if (!field) {
        upsert({
          key,
          label: key.replace(/_/g, ' '),
          inputType: normalizedOptions.length > 0 ? 'select' : 'text',
          options: normalizedOptions,
        });
        return;
      }
      const mergedOptions = toSelectOptions([...(field.options || []), ...normalizedOptions]);
      byKey.set(key, {
        ...field,
        inputType: mergedOptions.length > 0 ? 'select' : field.inputType,
        options: mergedOptions,
      });
    });

    const gradeField = byKey.get('grade');
    if (gradeField) {
      byKey.set('grade', {
        ...gradeField,
        inputType: 'select',
        options: toSelectOptions([...(gradeField.options || []), ...(gradeOptions || [])]),
      });
    }

    return DEFAULT_FIELDS
      .map((base) => byKey.get(base.key))
      .filter(Boolean);
  }, [filterOptions, gradeOptions, valueOptions]);

  const fieldByKey = useMemo(
    () => Object.fromEntries(fieldsCatalog.map((field) => [field.key, field])),
    [fieldsCatalog]
  );

  const normalizedFilters = useMemo(
    () => (Array.isArray(filters) ? filters : []).map((item) => ({
      field: toCanonicalField(item?.field),
      value: normalize(item?.value),
    })).filter((item) => item.field !== '' && ALLOWED_FIELDS.has(item.field)),
    [filters]
  );

  const activeFieldKeys = useMemo(
    () => normalizedFilters.map((item) => item.field),
    [normalizedFilters]
  );

  const addableFields = useMemo(
    () => fieldsCatalog.filter((field) => !activeFieldKeys.includes(field.key)),
    [activeFieldKeys, fieldsCatalog]
  );

  const hasSearch = normalize(search) !== '';
  const hasFilters = normalizedFilters.some((item) => item.value !== '');

  const currentQuery = useMemo(
    () => buildPersonnelQuery({
      search,
      filters: normalizedFilters,
      basePath: queryBasePath,
    }),
    [normalizedFilters, queryBasePath, search]
  );

  useEffect(() => {
    const handleOutside = (event) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setIsAddMenuOpen(false);
      }
    };
    if (!isAddMenuOpen) return undefined;
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isAddMenuOpen]);

  useEffect(() => {
    if (typeof onQueryChange === 'function') {
      onQueryChange(currentQuery);
    }
  }, [currentQuery, onQueryChange]);

  const updateFilter = (fieldKey, nextValue) => {
    const canonicalKey = toCanonicalField(fieldKey);
    if (!ALLOWED_FIELDS.has(canonicalKey)) return;

    const value = normalize(nextValue);
    setFilters((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (
        toCanonicalField(item?.field) === canonicalKey
          ? { field: canonicalKey, value }
          : item
      ))
    );

    if (canonicalKey === 'type_personnel') {
      setTypeFilter(value);
    }
  };

  const removeFilter = (fieldKey) => {
    const canonicalKey = toCanonicalField(fieldKey);
    if (!ALLOWED_FIELDS.has(canonicalKey)) return;

    setFilters((prev) =>
      (Array.isArray(prev) ? prev : []).filter((item) => toCanonicalField(item?.field) !== canonicalKey)
    );

    if (canonicalKey === 'type_personnel') {
      setTypeFilter('');
    }
  };

  const addFilter = (fieldKey) => {
    const canonicalKey = toCanonicalField(fieldKey);
    if (!canonicalKey || !ALLOWED_FIELDS.has(canonicalKey) || activeFieldKeys.includes(canonicalKey)) {
      setIsAddMenuOpen(false);
      return;
    }

    const field = fieldByKey[canonicalKey];
    const defaultValue = field?.inputType === 'select' && field.options.length === 1
      ? field.options[0]
      : '';

    setFilters((prev) => [...(Array.isArray(prev) ? prev : []), { field: canonicalKey, value: defaultValue }]);

    if (canonicalKey === 'type_personnel') {
      setTypeFilter(defaultValue);
    }

    setIsAddMenuOpen(false);
  };

  const clearAll = () => {
    setSearch('');
    setFilters([]);
    setTypeFilter('');
    onYearChange('');
    if (typeof onReset === 'function') {
      onReset();
      return;
    }
    onApply();
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 transition-all duration-200 focus-within:border-sky-300 focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Search size={14} />
        </span>

        {normalizedFilters.map((filter) => {
          const field = fieldByKey[filter.field] || {
            key: filter.field,
            label: filter.field,
            inputType: 'text',
            options: [],
          };

          return (
            <div
              key={filter.field}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 transition-all duration-200 hover:-translate-y-[1px] hover:border-sky-200 hover:bg-white"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                {field.label}:
              </span>

              {field.inputType === 'select' ? (
                <select
                  value={filter.value}
                  onChange={(event) => updateFilter(field.key, event.target.value)}
                  className="h-7 min-w-[120px] rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Choisir...</option>
                  {field.options.map((option) => (
                    <option key={`${field.key}-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.inputType === 'number' ? 'number' : 'text'}
                  value={filter.value}
                  onChange={(event) => updateFilter(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="h-7 w-[130px] rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              )}

              <button
                type="button"
                onClick={() => removeFilter(field.key)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-100"
                aria-label={`Supprimer ${field.label}`}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onApply();
            }
          }}
          placeholder="Rechercher personnel..."
          className="h-8 min-w-[220px] flex-1 bg-transparent px-1 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none"
        />

        <div className="relative" ref={addMenuRef}>
          <button
            type="button"
            onClick={() => setIsAddMenuOpen((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-100"
            aria-label="Ajouter un filtre"
          >
            <Plus size={13} />
            Filtre
            <ChevronDown size={12} className={`transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
              <div className="border-b border-slate-100 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Ajouter un filtre
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {addableFields.length === 0 && (
                  <p className="px-3 py-2 text-xs font-semibold text-slate-400">Tous les filtres sont deja actifs.</p>
                )}
                {addableFields.map((field) => (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => addFilter(field.key)}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-semibold text-slate-500">
          {normalizedFilters.length} filtre(s) actif(s){hasSearch ? ' • recherche active' : ''}
        </p>
        <div className="flex items-center gap-2">
          {(hasSearch || hasFilters) && (
            <button
              type="button"
              onClick={clearAll}
              className="h-8 rounded-full border border-slate-200 bg-white px-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-100"
            >
              Reinitialiser
            </button>
          )}
          <button
            type="button"
            onClick={onApply}
            className="h-8 rounded-full bg-slate-900 px-3 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
          >
            Rechercher
          </button>
        </div>
      </div>

      <p className="mt-1 px-1 text-[10px] font-medium text-slate-400" title={currentQuery}>
        {currentQuery}
      </p>
    </div>
  );
};

export default PersonnelFilterBar;
