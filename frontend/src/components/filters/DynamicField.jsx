import React from 'react';
import { Trash2 } from 'lucide-react';

const baseInputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100';

const DynamicField = ({
  field = '',
  value = '',
  onFieldChange = () => {},
  onValueChange = () => {},
  onRemove = () => {},
}) => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
    <input
      type="text"
      value={field}
      onChange={(event) => onFieldChange(event.target.value)}
      placeholder="Nom du champ"
      className={baseInputClass}
    />
    <input
      type="text"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder="Valeur"
      className={baseInputClass}
    />
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-100 sm:w-10"
      aria-label="Supprimer ce filtre dynamique"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

export default DynamicField;
