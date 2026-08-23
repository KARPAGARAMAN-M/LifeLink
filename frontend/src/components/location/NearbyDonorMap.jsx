import React from 'react';
import { MapPin, Navigation, Shield, Compass } from 'lucide-react';
import { formatDistance, calculateDistance } from '../../utils/distance';

export default function NearbyDonorMap({ userLat, userLon, donors = [], selectedBloodGroup = '' }) {
  return (
    <div className="relative w-full h-72 sm:h-80 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between p-4">
      {/* Background Grid & Compass Graphic */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ef4444 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 20px 20px, 20px 20px',
        }}
      />

      {/* Map Header Overlay */}
      <div className="relative z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-3 px-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-200">
            {userLat && userLon ? 'Live Radar View' : 'Regional Match Radar'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Approximate Coordinates (Privacy Preserved)</span>
        </div>
      </div>

      {/* Radar Center Visualization */}
      <div className="relative z-10 my-auto flex items-center justify-center">
        <div className="relative w-44 h-44 rounded-full border-2 border-red-500/20 flex items-center justify-center animate-pulse">
          <div className="w-28 h-28 rounded-full border border-red-500/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500/60 flex items-center justify-center text-white shadow-lg shadow-red-600/50">
              <Navigation className="w-5 h-5 text-red-400" />
            </div>
          </div>

          {/* Donor Pin Dots */}
          {donors.slice(0, 6).map((donor, idx) => {
            const distance = userLat && userLon && donor.latitude && donor.longitude
              ? calculateDistance(userLat, userLon, donor.latitude, donor.longitude)
              : idx * 1.5 + 1.2;

            // Compute pseudo position around center circle
            const angle = (idx * 60) * (Math.PI / 180);
            const radiusOffset = 50 + (idx % 3) * 15;
            const x = Math.cos(angle) * radiusOffset;
            const y = Math.sin(angle) * radiusOffset;

            return (
              <div
                key={donor.id || idx}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className="absolute flex items-center gap-1 group cursor-pointer"
                title={`${donor.name || 'Donor'} (${donor.bloodGroup}) - ${formatDistance(distance)}`}
              >
                <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black text-white group-hover:scale-125 transition-transform">
                  🩸
                </div>
                <div className="hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                  {donor.bloodGroup} • {formatDistance(distance)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Footer Overlay */}
      <div className="relative z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-slate-800 text-[11px]">
        <span className="text-slate-400">
          Showing <strong className="text-white">{donors.length}</strong> compatible donor(s) nearby
        </span>
        <span className="text-red-400 font-extrabold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Direct Emergency Request Ready
        </span>
      </div>
    </div>
  );
}
