export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-surface-200 dark:border-surface-700 rounded-full animate-spin`}>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary-500 rounded-full" />
        </div>
        {/* Blood drop animation */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-500 rounded-full animate-bounce opacity-75" />
      </div>
      {text && (
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}
