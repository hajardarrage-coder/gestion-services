﻿import React, { useEffect, useRef, useState } from 'react';
import { Filter, Plus, Search, X } from 'lucide-react';

const normalizeText = (value) => value.toLowerCase().replace(/\s+/g, '');

const SearchFilters = ({
  search,
  setSearch,
  filters,
  setFilters,
  filterOptions,
  valueOptions,
  placeholder = 'Rechercher...',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const addFilter = (field) => {
    setFilters((prev) => [...prev, { field, value: '' }]);
    setShowMenu(false);
  };

  const addCustomFilter = () => {
    setFilters((prev) => [...prev, { field: '', value: '' }]);
    setShowMenu(false);
  };

  const updateFilter = (index, patch) => {
    setFilters((prev) => prev.map((filter, idx) => (idx === index ? { ...filter, ...patch } : filter)));
  };

  const removeFilter = (index) => {
    setFilters((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 outline-none bg-transparent text-sm font-semibold text-slate-700"
            />
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 bg-slate-900 text-white rounded-md text-xs font-black uppercase tracking-widest"
              aria-label="Ouvrir filtres"
            >
              <Filter size={14} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Filtres</div>
                {filterOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => addFilter(option.key)}
                    className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
                  >
                    {option.label}
                  </button>
                ))}
                <div className="border-t border-slate-100" />
                <button
                  type="button"
                  onClick={addCustomFilter}
                  className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50"
                >
                  Champ personnalise
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={addCustomFilter}
            className="p-2 bg-white border border-slate-200 rounded-md text-xs font-black uppercase tracking-widest text-slate-600"
            aria-label="Ajouter champ"
          >
            <Plus size={14} />
          </button>
        </div>

        {filters.length > 0 && (
          <>
            <datalist id="filter-fields-list">
              {filterOptions.map((item) => (
                <option key={item.key} value={item.label} />
              ))}
            </datalist>
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter, index) => {
                const option = filterOptions.find((item) => item.key === filter.field);
                const values = valueOptions[filter.field] || [];
                const listId = `filter-list-${filter.field || 'custom'}-${index}`;
                const fieldDisplay = option?.label || filter.field;
                return (
                  <div key={`${filter.field || 'custom'}-${index}`} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                    <input
                      list="filter-fields-list"
                      value={fieldDisplay}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const match = filterOptions.find(
                          (item) => normalizeText(item.label) === normalizeText(raw) || normalizeText(item.key) === normalizeText(raw)
                        );
                        updateFilter(index, { field: match ? match.key : raw, value: '' });
                      }}
                      placeholder="Champ"
                      className="bg-transparent text-xs font-bold uppercase tracking-wider text-slate-500 outline-none w-28"
                    />
                    <input
                      list={listId}
                      value={filter.value}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                      placeholder={option?.label || 'Valeur'}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 outline-none"
                    />
                    <datalist id={listId}>
                      {values.map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                    <button
                      type="button"
                      onClick={() => removeFilter(index)}
                      className="text-slate-400 hover:text-red-500"
                      aria-label="Supprimer filtre"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
