import React, { useState } from 'react';
import { X, ShieldAlert, Send } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { submitReport } from '../../api/reportApi';
import toast from 'react-hot-toast';

export default function ReportModal({ targetType, targetId, targetName, onClose }) {
  const [reason, setReason] = useState('Suspicious Activity');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReport({
        targetType,
        targetId,
        reason,
        details,
      });
      toast.success('Report submitted for admin review. Thank you for keeping LifeLink safe!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report. Please log in first.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">Report {targetType}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Submitting report for <strong className="text-slate-800 dark:text-slate-200">{targetName}</strong>. Admin will investigate within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Reason for Report *"
            options={[
              'Suspicious Activity',
              'Fake Phone Number / Contact Information',
              'Inappropriate Behavior',
              'Demanding Commercial Payment / Selling Blood',
              'Spam Request',
              'Other',
            ]}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Additional Details
            </label>
            <textarea
              rows={3}
              placeholder="Describe the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="danger" icon={Send} isLoading={submitting} className="w-full py-2.5 font-bold">
            Submit Abuse Report
          </Button>
        </form>
      </div>
    </div>
  );
}
