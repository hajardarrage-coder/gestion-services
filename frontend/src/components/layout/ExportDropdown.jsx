import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

const ExportDropdown = ({ onExport, loadingType = '' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isLoading = loadingType === 'excel' || loadingType === 'pdf';

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  const handleSelect = (type) => {
    setOpen(false);
    onExport(type);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !isLoading && setOpen((prev) => !prev)}
        disabled={isLoading}
        className="btn-secondary disabled:opacity-60"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
        <span>{isLoading ? 'Export...' : 'Export'}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-xl z-[9999] overflow-hidden animate-dropdown">
          <button
            type="button"
            onClick={() => handleSelect('excel')}
            className="w-full px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            Export Excel
          </button>
          <button
            type="button"
            onClick={() => handleSelect('pdf')}
            className="w-full px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <FileText size={14} className="text-red-600" />
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
