import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, Search } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <span className="text-[120px] font-black text-slate-200 dark:text-slate-800 select-none leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl text-white">
              <Heart className="w-10 h-10 fill-current animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The page or route you requested does not exist or has been relocated.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link to="/">
            <Button size="sm" variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/search">
            <Button size="sm" variant="secondary" icon={Search}>
              Find Donors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
