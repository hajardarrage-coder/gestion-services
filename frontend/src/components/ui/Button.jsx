import React from 'react';

const VARIANT_STYLES = {
  primary:
    'border border-transparent bg-slate-900 text-white shadow-[0_18px_55px_rgba(15,23,42,0.25)] hover:bg-slate-800 focus-visible:ring-slate-200',
  ghost:
    'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-blue-200',
};

const Button = ({
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  children,
  ...rest
}) => {
  const variantClass = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const classes = [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    variantClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
