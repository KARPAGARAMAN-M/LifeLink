import { Link } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        <div className="relative mb-8">
          <span className="text-[150px] font-display font-extrabold text-surface-100 dark:text-surface-800 select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-2xl animate-float">
              <FaHeartbeat className="text-white text-4xl" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary flex items-center gap-2">
            🏠 Back to Home
          </Link>
          <Link to="/search" className="btn-secondary flex items-center gap-2">
            🔍 Find Donors
          </Link>
        </div>
      </div>
    </div>
  );
}
