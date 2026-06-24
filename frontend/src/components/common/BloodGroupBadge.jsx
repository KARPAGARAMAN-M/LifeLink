const bgColors = {
  'A+': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'A-': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'B+': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'B-': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'AB+': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'AB-': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'O+': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'O-': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function BloodGroupBadge({ bloodGroup, size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-bold ${sizeClasses[size]} ${bgColors[bloodGroup] || 'bg-gray-100 text-gray-700'}`}>
      🩸 {bloodGroup}
    </span>
  );
}
