import React from 'react';
import { Heart, ShieldCheck, Users, Sparkles, Building2, Droplets } from 'lucide-react';
import Card from '../common/Card';

export default function WhyDonate() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-current text-red-500" /> Educational Information
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Why Donate <span className="text-red-600 dark:text-red-500">Blood?</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Understanding the real-world impact of voluntary blood donation in emergency care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="p-6 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">Critical Trauma & Surgery Support</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Blood donations provide immediate support for patients undergoing surgeries, emergency trauma care, and medical procedures.
          </p>
        </Card>

        <Card hover className="p-6 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">Sustaining Blood Bank Reserves</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Regular voluntary donations ensure local blood banks maintain safe operational inventory levels for unpredictable emergencies.
          </p>
        </Card>

        <Card hover className="p-6 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">Multi-Patient Impact</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Depending on component processing (red blood cells, platelets, plasma), a single donation can assist multiple recipients in need.
          </p>
        </Card>
      </div>

      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        <p>
          <span className="font-bold text-slate-700 dark:text-slate-300">Note:</span> Blood donation is a voluntary community service. Final eligibility is always verified during blood bank screening.
        </p>
      </div>
    </div>
  );
}
