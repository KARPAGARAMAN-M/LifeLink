import React, { useState } from 'react';
import { Droplet, Info, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../common/Card';

const COMPATIBILITY_MATRIX = {
  'O-': { giveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], receiveFrom: ['O-'] },
  'O+': { giveTo: ['O+', 'A+', 'B+', 'AB+'], receiveFrom: ['O+', 'O-'] },
  'A-': { giveTo: ['A-', 'A+', 'AB-', 'AB+'], receiveFrom: ['A-', 'O-'] },
  'A+': { giveTo: ['A+', 'AB+'], receiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'B-': { giveTo: ['B-', 'B+', 'AB-', 'AB+'], receiveFrom: ['B-', 'O-'] },
  'B+': { giveTo: ['B+', 'AB+'], receiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'AB-': { giveTo: ['AB-', 'AB+'], receiveFrom: ['AB-', 'A-', 'B-', 'O-'] },
  'AB+': { giveTo: ['AB+'], receiveFrom: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'] },
};

export default function BloodCompatibility() {
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const details = COMPATIBILITY_MATRIX[selectedGroup];

  return (
    <Card className="p-6 border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <CardHeader
        title="Blood Group Compatibility Reference"
        subtitle="Interactive recipient and donor matching lookup guide"
      />

      {/* Select Blood Group buttons */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Select Target Blood Type:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Object.keys(COMPATIBILITY_MATRIX).map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`py-2.5 rounded-xl font-black text-xs transition-all border flex items-center justify-center gap-1 ${
                selectedGroup === group
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-500'
              }`}
            >
              <span>{group}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Compatibility Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Can Receive From */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{selectedGroup} Can Receive Blood From:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {details.receiveFrom.map((g) => (
              <span key={g} className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-black text-xs shadow-sm">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Can Donate To */}
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-3">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-extrabold text-sm">
            <Droplet className="w-4 h-4 text-blue-600" />
            <span>{selectedGroup} Can Donate Blood To:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {details.giveTo.map((g) => (
              <span key={g} className="px-3 py-1 bg-blue-600 text-white rounded-lg font-black text-xs shadow-sm">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Medical Disclaimer:</strong>
          <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
            This compatibility matrix is provided for informational and educational purposes only. It is NOT medical advice or a substitute for professional cross-matching. Final blood transfusion compatibility must ALWAYS be verified through laboratory testing by qualified blood bank personnel before transfusion.
          </p>
        </div>
      </div>
    </Card>
  );
}
