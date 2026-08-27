import React, { useState } from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required = false,
  preventAutofill = false,
  onFocus,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [readOnly, setReadOnly] = useState(preventAutofill);

  const handleFocus = (e) => {
    if (preventAutofill) {
      setReadOnly(false);
    }
    if (onFocus) {
      onFocus(e);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          required={required}
          readOnly={readOnly}
          onFocus={handleFocus}
          className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} bg-slate-50 dark:bg-slate-900/90 border ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500 focus:border-primary-500'
          } rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>}
    </div>
  );
}

