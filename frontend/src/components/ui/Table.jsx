import React from 'react';
import Button from './Button';

const Table = ({
  columns = [],
  data = [],
  emptyText = 'Aucune donnée à afficher',
  className = '',
  pagination = null,
}) => {
  const wrapperClass = ['rounded-3xl border border-slate-200 bg-white/90 shadow-sm', className]
    .filter(Boolean)
    .join(' ');

  const hasPagination = Boolean(pagination && pagination.totalPages > 0);
  const {
    currentPage = 1,
    totalPages = 1,
    onPrevious,
    onNext,
    isLocked = false,
  } = pagination || {};

  const normalizedColumns = columns || [];

  return (
    <div className={wrapperClass}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {normalizedColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.32em] text-slate-500"
                >
                  {column.title || column.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(normalizedColumns.length, 1)}
                  className="px-4 py-6 text-center text-xs font-black uppercase tracking-[0.28em] text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowKey = row?.id ?? row?.uuid ?? `row-${rowIndex}`;
                return (
                  <tr key={rowKey} className="transition hover:bg-slate-50">
                    {normalizedColumns.map((column) => (
                      <td
                        key={`${rowKey}-${column.key}`}
                        className="px-4 py-3 align-top text-sm text-slate-700"
                      >
                        {typeof column.render === 'function'
                          ? column.render(row, rowIndex)
                          : row?.[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {hasPagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">
          <span>
            Page {currentPage} / {Math.max(1, totalPages)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={isLocked || !onPrevious || currentPage <= 1}
            >
              Précédent
            </Button>
            <Button
              variant="ghost"
              onClick={onNext}
              disabled={isLocked || !onNext || currentPage >= totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
