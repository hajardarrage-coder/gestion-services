import React from 'react';

const FilterPanel = ({
  isOpen = false,
  title = 'Filtres',
  subtitle = '',
  onApply = () => {},
  onReset = () => {},
  applyLabel = 'Appliquer',
  resetLabel = 'Reinitialiser',
  children,
}) => (
  <div
    className={`overflow-hidden transition-all duration-300 ease-out ${
      isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <div className="space-y-4">{children}</div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onReset}
          className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100"
        >
          {resetLabel}
        </button>
        <button
          type="button"
          onClick={onApply}
          className="h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md shadow-blue-500/25 transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
        >
          {applyLabel}
        </button>
      </div>
    </div>
  </div>
);

export default FilterPanel;
