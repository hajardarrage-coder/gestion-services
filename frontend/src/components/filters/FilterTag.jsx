import React from 'react';
import { X } from 'lucide-react';

const FilterTag = ({ label, value, onRemove }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
    <span className="max-w-[220px] truncate">
      {label}: {value}
    </span>
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-100"
      aria-label={`Supprimer le filtre ${label}`}
    >
      <X size={12} />
    </button>
  </span>
);

export default FilterTag;
