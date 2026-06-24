import { useEffect, useState, useRef } from 'react';

export default function StatsCard({ icon: Icon, label, value, gradient = 'from-primary-500 to-primary-700', delay = 0 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    if (target === 0) { setCount(0); return; }
    
    const timer = setTimeout(() => {
      const duration = 1500;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div ref={ref} className="glass-card p-6 card-hover">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-3xl font-display font-bold text-surface-900 dark:text-white">
            {count.toLocaleString()}
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}
