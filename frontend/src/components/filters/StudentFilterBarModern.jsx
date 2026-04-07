import React from 'react';
import { Search, MapPin, GraduationCap, Calendar, X } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

/**
 * StudentFilterBarModern
 * A professional, horizontal search bar for student management.
 * 
 * Props:
 * - search: current search string (Nom/Prénom)
 * - setSearch: function to update search
 * - filters: array of { field, value }
 * - setFilters: function to update filters
 * - cityOptions: array of strings for Ville
 * - bacYearOptions: array of strings for Année Bac
 * - schoolYearOptions: array of strings for Année Scolaire
 * - onApply: function to trigger search/fetch
 */
const StudentFilterBarModern = ({
  search = '',
  setSearch = () => {},
  filters = [],
  setFilters = () => {},
  cityOptions = [],
  bacYearOptions = [],
  schoolYearOptions = [],
  onApply = () => {},
}) => {
  const { t } = usePreferences();
  // Helper to get value for a specific field from the filters array
  const getFilterValue = (field) => {
    return filters.find((f) => f.field === field)?.value || '';
  };

  // Helper to update a specific field in the filters array
  const updateFilter = (field, value) => {
    setFilters((prev) => {
      const otherFilters = prev.filter((f) => f.field !== field);
      if (!value) return otherFilters;
      return [...otherFilters, { field, value }];
    });
  };

  const handleClear = () => {
    setSearch('');
    setFilters([]);
    onApply();
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2 sm:p-3 transition-all">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-2">
        
        {/* Search Input (Nom / Prénom) */}
        <div className="flex-1 min-w-[200px] relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApply()}
            placeholder={`${t('nom_prenom')}...`}
            className="w-full h-12 pl-11 pr-4 bg-slate-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all"
          />
        </div>

        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden lg:block w-px h-8 bg-slate-200 mx-1" />

        {/* Filter Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-2">
          
          {/* Ville / Province */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors">
              <MapPin size={16} />
            </div>
            <select
              value={getFilterValue('province')}
              onChange={(e) => updateFilter('province', e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-slate-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-700 appearance-none outline-none transition-all cursor-pointer"
            >
              <option value="">{t('city')}</option>
              {cityOptions.map((city) => (
                <option key={`city-${city}`} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Année Bac */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors">
              <GraduationCap size={16} />
            </div>
            <select
              value={getFilterValue('annee_bac')}
              onChange={(e) => updateFilter('annee_bac', e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-slate-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-700 appearance-none outline-none transition-all cursor-pointer"
            >
              <option value="">{t('bac_year')}</option>
              {bacYearOptions.map((year) => (
                <option key={`bac-${year}`} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Année Scolaire */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors">
              <Calendar size={16} />
            </div>
            <select
              value={getFilterValue('annee_scolaire')}
              onChange={(e) => updateFilter('annee_scolaire', e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-slate-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-700 appearance-none outline-none transition-all cursor-pointer"
            >
              <option value="">{t('school_year')}</option>
              {schoolYearOptions.map((year) => (
                <option key={`school-${year}`} value={year}>{year}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 lg:ml-2">
          { (search || filters.length > 0) && (
            <button
              onClick={handleClear}
              className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title={t('reset')}
            >
              <X size={20} />
            </button>
          )}
          <button
            onClick={onApply}
            className="flex-1 lg:flex-none h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200/50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Search size={18} />
            <span className="lg:hidden xl:inline">{t('search')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentFilterBarModern;
