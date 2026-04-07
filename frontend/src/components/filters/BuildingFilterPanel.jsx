import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

const normalize = (value) => String(value || '').trim();
const normalizeKey = (value) =>
  normalize(value)
    .toLowerCase()
    .replace(/\s+/g, '_');

const uniqueSorted = (values = []) =>
  Array.from(new Set((values || []).map((value) => normalize(value)).filter((value) => value !== '')))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

const normalizeInputType = (type = '') => {
  const value = normalize(type).toLowerCase();
  if (['select', 'dropdown'].includes(value)) return 'select';
  if (['number', 'numeric'].includes(value)) return 'number';
  if (value === 'date') return 'date';
  return 'text';
};

const toSelectOptions = (values = []) => uniqueSorted(values);

const buildBuildingQuery = ({
  search = '',
  filters = [],
  typeFilter = '',
  basePath = '/api/batiments',
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

  const normalizedType = normalize(typeFilter);
  const hasTypeField = (filters || []).some(
    (item) => normalizeKey(item?.field) === 'type_local'
  );
  if (normalizedType && !hasTypeField) {
    params.set('type_local', normalizedType);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

const ALLOWED_FIELD_KEYS = new Set(['type_local', 'capacite_unitaire']);
const GET_DEFAULT_FIELDS = (t) => [
  { key: 'type_local', label: t('local_type'), inputType: 'select' },
  { key: 'capacite_unitaire', label: t('unit_capacity'), inputType: 'number' },
];

const BuildingFilterPanel = ({
  search = '',
  setSearch = () => {},
  filters = [],
  setFilters = () => {},
  typeFilter = '',
  setTypeFilter = () => {},
  typeOptions = [],
  filterOptions = [],
  valueOptions = {},
  dynamicFieldOptions = [],
  onApply = () => {},
  onReset = null,
  onQueryChange = null,
  queryBasePath = '/api/batiments',
}) => {
  const { t } = usePreferences();
  const addMenuRef = useRef(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const fieldsCatalog = useMemo(() => {
    const byKey = new Map();
    const upsert = (field) => {
      const key = normalizeKey(field?.key || field?.field);
      if (!key) return;
      if (!ALLOWED_FIELD_KEYS.has(key)) return;

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
        placeholder: field?.placeholder || existing?.placeholder || t('search_placeholder'),
      });
    };

    GET_DEFAULT_FIELDS(t).forEach(upsert);
    (filterOptions || []).forEach(upsert);
    (dynamicFieldOptions || []).forEach(upsert);

    Object.entries(valueOptions || {}).forEach(([rawKey, rawOptions]) => {
      const key = normalizeKey(rawKey);
      if (!ALLOWED_FIELD_KEYS.has(key)) return;
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

    const typeField = byKey.get('type_local');
    if (typeField) {
      byKey.set('type_local', {
        ...typeField,
        options: toSelectOptions([...(typeField.options || []), ...(typeOptions || [])]),
      });
    }

    return Array.from(byKey.values()).sort((a, b) => a.label.localeCompare(b.label, 'fr', { numeric: true }));
  }, [dynamicFieldOptions, filterOptions, typeOptions, valueOptions, t]);

  const fieldByKey = useMemo(
    () => Object.fromEntries(fieldsCatalog.map((field) => [field.key, field])),
    [fieldsCatalog]
  );

  const normalizedFilters = useMemo(
    () => (Array.isArray(filters) ? filters : []).map((item) => ({
      field: normalizeKey(item?.field),
      value: normalize(item?.value),
    })).filter((item) => item.field !== '' && ALLOWED_FIELD_KEYS.has(item.field)),
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
    () => buildBuildingQuery({
      search,
      filters: normalizedFilters,
      typeFilter,
      basePath: queryBasePath,
    }),
    [normalizedFilters, queryBasePath, typeFilter, search]
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
    const normalizedKey = normalizeKey(fieldKey);
    if (!ALLOWED_FIELD_KEYS.has(normalizedKey)) return;
    const value = normalize(nextValue);
    setFilters((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (
        normalizeKey(item?.field) === normalizedKey
          ? { field: normalizedKey, value }
          : item
      ))
    );
    if (normalizedKey === 'type_local') {
      setTypeFilter(value);
    }
  };

  const removeFilter = (fieldKey) => {
    const normalizedKey = normalizeKey(fieldKey);
    if (!ALLOWED_FIELD_KEYS.has(normalizedKey)) return;
    setFilters((prev) =>
      (Array.isArray(prev) ? prev : []).filter((item) => normalizeKey(item?.field) !== normalizedKey)
    );
    if (normalizedKey === 'type_local') {
      setTypeFilter('');
    }
  };

  const addFilter = (fieldKey) => {
    const normalizedKey = normalizeKey(fieldKey);
    if (!normalizedKey || !ALLOWED_FIELD_KEYS.has(normalizedKey) || activeFieldKeys.includes(normalizedKey)) {
      setIsAddMenuOpen(false);
      return;
    }

    const field = fieldByKey[normalizedKey];
    const defaultValue = field?.inputType === 'select' && field.options.length === 1
      ? field.options[0]
      : '';

    setFilters((prev) => [...(Array.isArray(prev) ? prev : []), { field: normalizedKey, value: defaultValue }]);
    if (normalizedKey === 'type_local') {
      setTypeFilter(defaultValue);
    }
    setIsAddMenuOpen(false);
  };

  const clearAll = () => {
    setSearch('');
    setFilters([]);
    setTypeFilter('');
    if (typeof onReset === 'function') {
      onReset();
      return;
    }
    onApply();
  };

  const hasTypeField = normalizedFilters.some((item) => item.field === 'type_local');
  useEffect(() => {
    const normalizedType = normalize(typeFilter);
    if (!normalizedType || hasTypeField) return;
    setFilters((prev) => [...(Array.isArray(prev) ? prev : []), { field: 'type_local', value: normalizedType }]);
  }, [hasTypeField, setFilters, typeFilter]);

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
          const displayValue = filter.value;

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
                  value={displayValue}
                  onChange={(event) => updateFilter(field.key, event.target.value)}
                  className="h-7 min-w-[120px] rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">{t('search_placeholder')}</option>
                  {field.options.map((option) => (
                    <option key={`${field.key}-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.inputType === 'number' ? 'number' : field.inputType === 'date' ? 'date' : 'text'}
                  value={displayValue}
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
          placeholder={`${t('search_placeholder')}...`}
          className="h-8 min-w-[220px] flex-1 bg-transparent px-1 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none"
        />

        <div className="relative" ref={addMenuRef}>
          <button
            type="button"
            onClick={() => setIsAddMenuOpen((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-100"
            aria-label={t('add_filter')}
          >
            <Plus size={13} />
            {t('filters')}
            <ChevronDown size={12} className={`transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
              <div className="border-b border-slate-100 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                {t('add_filter')}
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {addableFields.length === 0 && (
                  <p className="px-3 py-2 text-xs font-semibold text-slate-400">{t('no_active_filters')}</p>
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
          {normalizedFilters.length} {t('filters')} {hasSearch ? ` • ${t('search')} active` : ''}
        </p>
        <div className="flex items-center gap-2">
          {(hasSearch || hasFilters) && (
            <button
              type="button"
              onClick={clearAll}
              className="h-8 rounded-full border border-slate-200 bg-white px-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-100"
            >
              {t('reset')}
            </button>
          )}
          <button
            type="button"
            onClick={onApply}
            className="h-8 rounded-full bg-slate-900 px-3 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
          >
            {t('search')}
          </button>
        </div>
      </div>

      <p className="mt-1 px-1 text-[10px] font-medium text-slate-400" title={currentQuery}>
        {currentQuery}
      </p>
    </div>
  );
};

export default BuildingFilterPanel;
