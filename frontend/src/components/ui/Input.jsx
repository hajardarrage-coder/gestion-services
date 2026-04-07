import React from 'react';

const Input = ({
  label,
  helperText,
  as = 'input',
  className = '',
  inputClassName = '',
  ...rest
}) => {
  const FieldTag = as === 'textarea' ? 'textarea' : 'input';
  const { id, ...fieldProps } = rest;
  const containerClass = ['flex flex-col gap-2', className].filter(Boolean).join(' ');
  const fieldClass = [
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500"
        >
          {label}
        </label>
      )}
      <FieldTag className={fieldClass} id={id} {...fieldProps} />
      {helperText && (
        <span className="text-xs font-medium text-slate-500">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
