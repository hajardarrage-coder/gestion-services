import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

const InlineSearchFilterBar = ({
  search,
  setSearch,
  filters,
  setFilters,
  filterOptions = [],
  valueOptions = {},
  placeholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState('');
  const triggerRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const fields = useMemo(
    () =>
      (filterOptions || []).map((opt) => ({
        key: normalizeKey(opt.key),
        label: opt.label || opt.key,
      })),
    [filterOptions]
  );

  const fieldByKey = useMemo(
    () =>
      fields.reduce((acc, item) => {
        acc[item.key] = item.label;
        return acc;
      }, {}),
    [fields]
  );

  const addFilter = (field, value) => {
    if (!field || !value) return;
    const normalizedField = normalizeKey(field);
    const normalizedValue = String(value).trim();
    if (!normalizedValue) return;
    setFilters((prev) => [...(prev || []), { field: normalizedField, value: normalizedValue }]);
  };

  const removeFilter = (indexToRemove) => {
    setFilters((prev) => (prev || []).filter((_, idx) => idx !== indexToRemove));
  };

  const availableValues = activeField ? valueOptions[activeField] || [] : [];

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.right,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="w-full relative isolate">
      <div className="flex items-center flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <Search size={16} className="text-slate-400" />

        {(filters || []).map((filter, index) => (
          <span
            key={`${filter.field}-${filter.value}-${index}`}
            className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            <span className="text-slate-700">
              ✓ {fieldByKey[filter.field] || filter.field}: {filter.value}
            </span>
            <button
              type="button"
              onClick={() => removeFilter(index)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Remove filter"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          className="flex-grow outline-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 min-w-[160px]"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setActiveField('');
            }}
            ref={triggerRef}
            className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 transition"
          >
            Ajouter filtre
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {isOpen && createPortal(
        <div
          className="fixed z-[9999] animate-dropdown"
          style={{ top: menuPos.top, left: menuPos.left, transform: 'translateX(-100%)' }}
        >
          <div className="w-64 rounded-xl border border-slate-200 bg-white shadow-xl">
            {!activeField && (
              <div className="p-2">
                <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-400">Champs</p>
                {(fields || []).map((field) => (
                  <button
                    key={field.key}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setActiveField(field.key)}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            )}

            {activeField && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    {fieldByKey[activeField] || activeField}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveField('')}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Retour
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {(availableValues || []).map((val) => (
                    <button
                      key={`${activeField}-${val}`}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                      onClick={() => {
                        addFilter(activeField, val);
                        setIsOpen(false);
                        setActiveField('');
                      }}
                    >
                      {val}
                    </button>
                  ))}
                  {(availableValues || []).length === 0 && (
                    <p className="px-3 py-2 text-sm text-slate-400">Aucune valeur</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InlineSearchFilterBar;
