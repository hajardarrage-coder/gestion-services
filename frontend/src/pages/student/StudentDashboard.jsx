import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, GraduationCap, Clock3, ShieldCheck } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setStudent(user);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/my-demandes`);
        setDemandes(response.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-10 font-inter">
      <DashboardHeader
        label="Espace étudiant"
        title="Suivi académique et demandes"
        description="Votre console personnelle pour suivre les demandes administratives et vos informations clés."
        actions={
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold text-xs uppercase">
              {student?.name?.[0] || 'S'}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 text-xs leading-none">{student?.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">{student?.filiere}</p>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Moyenne" value="14.50" helper="Semestre en cours" />
        <StatCard icon={FileText} label="Demandes" value={demandes.length} helper="Total envoyées" accent="from-amber-500 to-orange-500" />
        <StatCard icon={Clock3} label="En attente" value={demandes.filter((d) => d.statut !== 'completed').length} helper="En cours de traitement" accent="from-sky-500 to-cyan-500" />
        <StatCard icon={ShieldCheck} label="Validées" value={demandes.filter((d) => d.statut === 'completed').length} helper="Clôturées" accent="from-emerald-500 to-green-500" />
      </div>

      <div className="panel-glass p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Dernières requêtes
          </h3>
          <button className="btn-ghost text-indigo-600">Voir tout</button>
        </div>
        <div className="space-y-2">
          {demandes.map((d) => (
            <div key={d.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between group hover:bg-white border border-transparent hover:border-slate-100 transition-all">
              <div>
                <p className="font-bold text-slate-900 text-xs uppercase tracking-tight">{d.titre || d.type}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{d.date}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                d.statut === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {d.statut}
              </span>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full">
          <FileText size={16} />
          Nouvelle requête
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
