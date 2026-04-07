import React from 'react';
import { Sparkles } from 'lucide-react';

const DashboardHeader = ({ label, title, description, actions }) => {
  return (
    <div className="dashboard-hero">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-400/30">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-400">{label}</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight font-display">{title}</h1>
          <p className="text-slate-600 font-semibold mt-2 max-w-3xl">{description}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
};

export default DashboardHeader;
