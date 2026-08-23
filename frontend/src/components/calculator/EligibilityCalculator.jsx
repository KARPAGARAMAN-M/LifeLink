import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, Info, HeartPulse } from 'lucide-react';
import { checkEligibility } from '../../utils/eligibilityCalculator';
import Card, { CardHeader } from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

export default function EligibilityCalculator({ className = '' }) {
  const [lastDate, setLastDate] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!lastDate) return;
    const res = checkEligibility(lastDate);
    setResult(res);
  };

  return (
    <Card className={`border-red-100 dark:border-red-950/50 shadow-xl ${className}`}>
      <CardHeader
        title="Can I Donate Blood Today?"
        subtitle="Check your estimated donation readiness interval"
        action={
          <div className="p-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
        }
      />

      <form onSubmit={handleCalculate} className="space-y-4">
        <Input
          label="Last Blood Donation Date"
          type="date"
          icon={Calendar}
          value={lastDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setLastDate(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" className="w-full justify-center">
          Calculate Eligibility
        </Button>
      </form>

      {result && (
        <div className="mt-6 p-4 rounded-2xl border transition-all animate-fadeIn">
          {result.eligible ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>You May Be Eligible to Donate!</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                It has been {result.daysSinceLast || 56}+ days since your last donation. You are ready to save lives again.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-sm">
                <Clock className="w-5 h-5" />
                <span>Wait Period Active</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {result.message}
              </p>
              {result.nextEligibleDate && (
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span>Next Eligible Date:</span>
                  <span>{result.nextEligibleDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Medical Note:</strong> This calculation is an estimate based on standard 56-day donation intervals. Final medical clearance is performed by certified healthcare staff on-site.
        </span>
      </div>
    </Card>
  );
}
