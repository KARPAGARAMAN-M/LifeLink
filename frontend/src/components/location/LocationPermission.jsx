import React from 'react';
import { MapPin, Navigation, AlertCircle, Compass } from 'lucide-react';
import Button from '../common/Button';

export default function LocationPermission({
  onAllowLocation,
  onManualSearch,
  loading,
  permissionDenied,
  latitude,
  longitude,
}) {
  if (latitude && longitude) {
    return (
      <div className="flex items-center justify-between p-3 px-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
          <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>📍 Location Detected</span>
        </div>
        <button
          onClick={onAllowLocation}
          className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          Refresh GPS
        </button>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Location access is turned off. You can still search manually.</span>
        </div>
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={onManualSearch} className="text-xs">
            Search by City / State
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 border border-red-800/50 rounded-3xl text-white shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-red-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              Find Donors Near Your Location
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Allow LifeLink to use your location to find available blood donors nearby in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="danger"
            onClick={onAllowLocation}
            isLoading={loading}
            icon={Navigation}
            className="flex-1 sm:flex-none font-bold shadow-lg shadow-red-600/40"
          >
            Allow Location
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onManualSearch}
            className="flex-1 sm:flex-none text-slate-300 border-slate-700 hover:bg-slate-800"
          >
            Search Manually
          </Button>
        </div>
      </div>
    </div>
  );
}
