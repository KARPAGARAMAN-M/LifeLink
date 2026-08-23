import React from 'react';

export default function Card({ children, className = '', hover = false, border = true, padding = 'p-6', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl ${border ? 'border border-slate-200/80 dark:border-slate-800' : ''} ${
        hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-500/30' : 'shadow-sm'
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      <div>
        {title && <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
