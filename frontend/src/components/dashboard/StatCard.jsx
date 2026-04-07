import React from 'react';

const StatCard = ({ icon: Icon, label, value, helper, accent = 'from-indigo-500 to-blue-500' }) => {
  return (
    <div className="stat-modern">
      <div className={`stat-modern__icon bg-gradient-to-br ${accent}`}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.24em] font-black text-slate-400">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {helper && <p className="text-xs font-semibold text-slate-500">{helper}</p>}
      </div>
    </div>
  );
};

export default StatCard;
