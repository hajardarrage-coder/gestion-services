import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X, CheckSquare, Square, Filter } from 'lucide-react';

const CUSTOM_FIELD = '__custom_field__';

/**
 * Unified, reusable filter bar (students, personnel, buildings).
 * - One debounced search input handled by parent (provide search/setSearch + parent debounce).
 * - Multi-select per field (checkboxes).
 * - Dynamic options (valueOptions[field] = [{ value, label } | primitive]).
 * - Badges to remove individual selections.
 *
 * Props (backward compatible):
 *  - search, setSearch
 *  - filters (array of { field, value })
 *  - setFilters
 *  - filterOptions: [{ key, label }]
 *  - valueOptions: { [field]: Array< {value,label} | string | number > }
 *  - placeholder, onSearch (optional)
 */

const normalizeFieldKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

const prettify = (text) =>
  String(text || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ensureOptionObjects = (rawList = []) =>
  rawList.map((item) =>
    typeof item === 'object'
      ? { value: String(item.value), label: item.label ?? String(item.value) }
      : { value: String(item), label: String(item) }
  );

const SearchFilterBar = ({
  search,
  setSearch,
  filters,
  setFilters,
  filterOptions = [],
  valueOptions = {},
  allowCustomField = true,
  hideSearch = false,
  placeholder = 'Recherche...',
  onSearch,
  autocompleteSuggestions = null,
  autocompleteLoading = false,
  onSelectSuggestion,
}) => {
  const [fieldOpen, setFieldOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const dropdownRef = useRef(null);

  // Build field catalog (union of provided filterOptions + keys in valueOptions)
  const fields = useMemo(() => {
    const seen = new Set();
    const ordered = [];

    // 1) keep the incoming order from filterOptions (so callers control priority)
    filterOptions.forEach((opt) => {
      const key = normalizeFieldKey(opt.key);
      if (!key || seen.has(key)) return;
      seen.add(key);
      ordered.push({ key, label: opt.label || prettify(key) });
    });

    // 2) append any extras coming from valueOptions, alphabetically
    const extras = [];
    Object.keys(valueOptions || {}).forEach((raw) => {
      const key = normalizeFieldKey(raw);
      if (!key || seen.has(key)) return;
      seen.add(key);
      extras.push({ key, label: prettify(key) });
    });

    extras.sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
    return [...ordered, ...extras];
  }, [filterOptions, valueOptions]);

  const labelByKey = useMemo(
    () =>
      fields.reduce((acc, f) => {
        acc[f.key] = f.label;
        return acc;
      }, {}),
    [fields]
  );

  // Map current filters -> { field: [values...] }
  const selectedByField = useMemo(() => {
    const out = {};
    (filters || []).forEach((f) => {
      const key = normalizeFieldKey(f.field);
      if (!key) return;
      if (!out[key]) out[key] = [];
      out[key].push(String(f.value));
    });
    return out;
  }, [filters]);

  const setFieldValues = (field, values) => {
    const normalizedField = normalizeFieldKey(field);
    const uniqueValues = Array.from(new Set((values || []).map((v) => String(v))));
    setFilters((prev) => {
      const others = (prev || []).filter((f) => normalizeFieldKey(f.field) !== normalizedField);
      const additions = uniqueValues.map((v) => ({ field: normalizedField, value: v }));
      return [...others, ...additions];
    });
  };

  const toggleValue = (value) => {
    const current = selectedByField[activeField] || [];
    if (current.includes(value)) {
      setFieldValues(
        activeField,
        current.filter((v) => v !== value)
      );
    } else {
      setFieldValues(activeField, [...current, value]);
    }
  };

  const clearField = (field) => setFieldValues(field, []);

  const clearAll = () => {
    setFilters([]);
    setSearch('');
    setActiveField('');
    setCustomFieldName('');
    setCustomFieldValue('');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current || dropdownRef.current.contains(e.target)) return;
      setFieldOpen(false);
      setValueOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeOptions = ensureOptionObjects(valueOptions[activeField] || []);
  const activeSelections = selectedByField[activeField] || [];
  const allSelected = activeOptions.length > 0 && activeSelections.length === activeOptions.length;

  const suggestionGroups = {
    noms: Array.isArray(autocompleteSuggestions?.noms) ? autocompleteSuggestions.noms : [],
    villes: Array.isArray(autocompleteSuggestions?.villes) ? autocompleteSuggestions.villes : [],
    pays: Array.isArray(autocompleteSuggestions?.pays) ? autocompleteSuggestions.pays : [],
  };
  const groupedSuggestions = [
    { key: 'noms', label: 'Noms', items: suggestionGroups.noms },
    { key: 'villes', label: 'Villes', items: suggestionGroups.villes },
    { key: 'pays', label: 'Pays', items: suggestionGroups.pays },
  ];
  const hasSuggestionResults = groupedSuggestions.some((group) => group.items.length > 0);
  const hasSearchInput = String(search || '').trim() !== '';
  const shouldShowSuggestions = !fieldOpen && !valueOpen && hasSearchInput && (autocompleteLoading || hasSuggestionResults);

  return (
    <div className="w-full relative isolate" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        {!hideSearch && (
          <div className="relative flex-1 min-w-[240px]">
            <input
              className="w-full h-11 pl-11 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typeof onSearch === 'function') onSearch();
              }}
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center gap-2 hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            onClick={() => {
              setFieldOpen((o) => !o);
              setValueOpen(false);
            }}
          >
            <Filter size={16} />{' '}
            {activeField === CUSTOM_FIELD
              ? customFieldName || 'Champ manuel'
              : activeField
                ? labelByKey[activeField] || prettify(activeField)
                : 'Champ'}
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {fieldOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white/98 shadow-[0_20px_45px_rgba(15,23,42,0.12)] overflow-hidden z-[9999] backdrop-blur-sm animate-dropdown">
              <div className="max-h-64 overflow-y-auto">
                {fields.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setActiveField(f.key);
                      setFieldOpen(false);
                      setValueOpen(true);
                      setCustomFieldName('');
                      setCustomFieldValue('');
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition ${f.key === activeField ? 'bg-indigo-50 text-slate-900' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    {f.label}
                    {selectedByField[f.key]?.length ? (
                      <span className="ml-2 text-xs text-indigo-600">• {selectedByField[f.key].length}</span>
                    ) : null}
                  </button>
                ))}
                {allowCustomField && (
                  <div className="border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveField(CUSTOM_FIELD);
                        setFieldOpen(false);
                        setValueOpen(true);
                        setCustomFieldName('');
                        setCustomFieldValue('');
                      }}
                    className="w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Ajouter un champ manuel
                    </button>
                  </div>
                )}
                {fields.length === 0 && <div className="px-3 py-2 text-sm text-slate-400">Aucun champ</div>}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          onClick={clearAll}
        >
          Réinitialiser
        </button>

        <button
          type="button"
          className="h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
          onClick={() => typeof onSearch === 'function' && onSearch()}
        >
          Rechercher
        </button>
      </div>

      {valueOpen && (
        <div className="relative">
          <div className="absolute z-[9999] mt-2 w-full rounded-2xl border bg-white shadow-2xl p-3 animate-dropdown">
            {activeField === CUSTOM_FIELD ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Champ manuel</p>
                  <input
                    value={customFieldName}
                    onChange={(e) => setCustomFieldName(e.target.value)}
                    placeholder="Nom du champ (ex: specialite)"
                    className="w-full h-10 rounded-lg border px-3 text-sm focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Valeur</p>
                  <input
                    value={customFieldValue}
                    onChange={(e) => setCustomFieldValue(e.target.value)}
                    placeholder="Valeur"
                    className="w-full h-10 rounded-lg border px-3 text-sm focus:ring-2 focus:ring-indigo-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customFieldName.trim() && customFieldValue.trim()) {
                        setFieldValues(customFieldName, [customFieldValue]);
                        setValueOpen(false);
                        setActiveField('');
                        setCustomFieldName('');
                        setCustomFieldValue('');
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    className="h-9 px-3 rounded-lg border text-xs font-semibold text-slate-600 hover:border-slate-300"
                    onClick={() => {
                      setValueOpen(false);
                      setActiveField('');
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    disabled={!customFieldName.trim() || !customFieldValue.trim()}
                    className="h-9 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold disabled:opacity-50"
                    onClick={() => {
                      if (!customFieldName.trim() || !customFieldValue.trim()) return;
                      setFieldValues(customFieldName, [customFieldValue]);
                      setValueOpen(false);
                      setActiveField('');
                      setCustomFieldName('');
                      setCustomFieldValue('');
                    }}
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-700">
                    {labelByKey[activeField] || prettify(activeField)}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      className="text-indigo-600 hover:underline disabled:text-slate-300"
                      disabled={!activeOptions.length}
                      onClick={() => setFieldValues(activeField, activeOptions.map((o) => o.value))}
                    >
                      Tout
                    </button>
                    <button className="text-slate-500 hover:underline" onClick={() => clearField(activeField)}>
                      Vider
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {activeOptions.map((opt) => {
                    const checked = activeSelections.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 text-sm text-left"
                        onClick={() => toggleValue(opt.value)}
                      >
                        {checked ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} className="text-slate-300" />}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                  {activeOptions.length === 0 && (
                    <div className="px-2 py-2 text-sm text-slate-400">Aucune valeur disponible</div>
                  )}
                </div>
                <div className="mt-3 text-right text-xs text-slate-500">
                  {activeSelections.length} sélection(s){allSelected ? ' • Toutes' : ''}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {(filters || []).map((filter, idx) => {
          const fieldKey = normalizeFieldKey(filter.field);
          const label = labelByKey[fieldKey] || prettify(fieldKey);
          return (
            <span
              key={`${fieldKey}-${filter.value}-${idx}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
            >
              <span>{label}: {filter.value}</span>
              <button
                type="button"
                onClick={() => {
                  const remaining = (filters || []).filter(
                    (f, i) => !(i === idx)
                  );
                  setFilters(remaining);
                }}
                className="rounded-full text-slate-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                aria-label={`Supprimer ${label}`}
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
      </div>

      {shouldShowSuggestions && (
        <div className="mt-2 rounded-xl border border-slate-200 bg-white/98 p-3 shadow-[0_18px_38px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          {autocompleteLoading ? (
            <p className="text-xs font-semibold text-slate-500">Recherche...</p>
          ) : (
            <div className="space-y-3">
              {groupedSuggestions.map((group) => (
                <div key={group.key}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {group.label}
                  </p>
                  {group.items.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <button
                          key={`${group.key}-${item}`}
                          type="button"
                          onClick={() => {
                            const value = String(item || '').trim();
                            if (!value) return;
                            setSearch(value);
                            if (typeof onSelectSuggestion === 'function') {
                              onSelectSuggestion(value);
                            } else if (typeof onSearch === 'function') {
                              onSearch();
                            }
                          }}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Aucun resultat</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
