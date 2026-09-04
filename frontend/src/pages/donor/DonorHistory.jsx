import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { History, Heart, Calendar, CheckCircle2, Building, MapPin, Award } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DonorHistory() {
  const [history, setHistory] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorHistory();
  }, []);

  const fetchDonorHistory = async () => {
    setLoading(true);
    try {
      const profRes = await api.get('/donors/my-profile');
      setDonorProfile(profRes.data?.data || null);

      const histRes = await api.get('/requests/donor-history');
      setHistory(histRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load donor history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Donation History..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/60 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-xs font-black uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-rose-400" />
              <span>Donor Records Only</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Donation History</h1>
            <p className="text-xs text-slate-400">Personal donation log and verified contribution records.</p>
          </div>

          {/* Stats Badge */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center sm:text-right">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Contributions</p>
            <h3 className="text-3xl font-black text-rose-400">{history.length} Donations</h3>
          </div>
        </div>

        {/* History Records List */}
        {history.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-white">No Completed Donations Recorded</h3>
              <p className="text-xs text-slate-400">
                When you accept and complete blood donation requests, your official donation history will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 font-black text-lg flex items-center justify-center flex-shrink-0">
                    {record.bloodGroup || donorProfile?.bloodGroup || 'O+'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{record.hospitalName || 'Local Medical Center'}</h3>
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                        COMPLETED
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>Date: <strong>{record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'Recent'}</strong></span>
                      <span>•</span>
                      <span>Location: <strong>{record.city || 'Local'}</strong></span>
                      <span>•</span>
                      <span>Request ID: <strong>REQ-{record.id}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black text-emerald-400">Verified Donation</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
