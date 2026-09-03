import React from 'react';
import { Stethoscope, CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import Card from '../common/Card';

export default function WhoCanDonate() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
          <Stethoscope className="w-3.5 h-3.5 text-red-500" /> Eligibility Guidelines
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Who Can <span className="text-red-600 dark:text-red-500">Donate Blood?</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          General donor parameters evaluated during professional screening.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> General Parameters
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Age typically between 18 and 65 years old.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Feeling healthy, well, and free from active infections or fever.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Minimum 56-day gap since your last whole blood donation.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Temporary Deferrals
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Recent tattoos, piercings, or minor surgical procedures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Current prescription antibiotic regimens or recent illnesses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Pregnancy or recent childbirth status.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* MANDATORY DISCLAIMER BOX */}
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm text-red-900 dark:text-red-200 space-y-2">
          <p className="font-black text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" /> MANDATORY MEDICAL DISCLAIMER
          </p>
          <p className="font-bold text-red-700 dark:text-red-300">
            Final eligibility is determined by the blood bank or qualified medical professional during donor screening.
          </p>
          <p className="text-xs text-red-600/90 dark:text-red-400/90">
            Donation eligibility can depend on your current health, detailed medical history, local blood-bank rules, and on-site screening prior to collection.
          </p>
        </div>
      </Card>
    </div>
  );
}
