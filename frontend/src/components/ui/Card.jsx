import React from 'react';

const Card = ({ title, subtitle, headerAction, children, className = '', ...rest }) => {
  const hasHeader = Boolean(title || subtitle || headerAction);
  const containerClass = [
    'rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_55px_rgba(15,23,42,0.08)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={containerClass} {...rest}>
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            {subtitle && (
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                {subtitle}
              </p>
            )}
            {title && (
              <p className="text-2xl font-black tracking-[0.06em] text-slate-900">
                {title}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex flex-wrap items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}

      {children && (
        <div className={`${hasHeader ? 'mt-5' : ''} space-y-4`}>{children}</div>
      )}
    </section>
  );
};

export default Card;
