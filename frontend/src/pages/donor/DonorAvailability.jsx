import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DonorAvailability() {
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailabilityReason, setUnavailabilityReason] = useState('Recently donated');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDonorProfile();
  }, []);

  const fetchDonorProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donors/my-profile');
      setDonorProfile(res.data?.data || null);
    } catch (err) {
      console.error('Failed to fetch donor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await api.patch('/donors/availability');
      setDonorProfile(res.data?.data || donorProfile);
    } catch (err) {
      alert('Failed to update availability status.');
    } finally {
      setUpdating(false);
    }
  };

  // Calculate Next Eligible Donation Date (56 days after last donation)
  let nextEligibleDate = 'Eligible Now';
  if (donorProfile?.lastDonationDate) {
    const lastDate = new Date(donorProfile.lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 56);
    nextEligibleDate = nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (loading) return <LoadingSpinner text="Loading Donor Availability..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Donor Availability Control</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Manage Your Availability
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Control when blood seekers can view and send donation requests to your profile.
          </p>
        </div>

        {/* Main Status Toggle Card */}
        <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          
          {/* Current Status Showcase */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Donor Status</span>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <span className={`text-3xl font-black ${donorProfile?.availability ? 'text-emerald-400' : 'text-red-400'}`}>
                  {donorProfile?.availability ? '🟢 AVAILABLE' : '🔴 UNAVAILABLE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {donorProfile?.availability
                  ? 'Your profile is active and visible in blood seeker donor searches.'
                  : 'You will NOT appear in search results or receive new blood requests.'}
              </p>
            </div>

            {/* Availability Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={donorProfile?.availability ? 'primary' : 'secondary'}
                size="lg"
                loading={updating}
                onClick={() => handleSetStatus(true)}
                className={`font-black ${
                  donorProfile?.availability
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                [ SET AVAILABLE ]
              </Button>

              <Button
                variant={!donorProfile?.availability ? 'danger' : 'secondary'}
                size="lg"
                loading={updating}
                onClick={() => handleSetStatus(false)}
                className={`font-black ${
                  !donorProfile?.availability
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                [ SET UNAVAILABLE ]
              </Button>
            </div>
          </div>

          {/* Optional Reason Selection when setting unavailable */}
          {!donorProfile?.availability && (
            <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/60 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-red-300">
                Optional Reason for Unavailability:
              </label>
              <select
                value={unavailabilityReason}
                onChange={(e) => setUnavailabilityReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-bold focus:outline-none"
              >
                <option value="Recently donated">Recently donated blood</option>
                <option value="Temporarily unavailable">Temporarily unavailable / Traveling</option>
                <option value="Medical recovery">Medical recovery / Not feeling well</option>
                <option value="Other">Other personal reason</option>
              </select>
            </div>
          )}

          {/* Profile Overview Meta Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider">Blood Group</span>
              <p className="text-lg font-black text-rose-400">{donorProfile?.bloodGroup || 'O+'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider">Current City</span>
              <p className="text-sm font-black text-white">{donorProfile?.city || 'Not Set'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider">Last Donation Date</span>
              <p className="text-sm font-black text-white">{donorProfile?.lastDonationDate || 'None recorded'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider">Next Eligible Date</span>
              <p className="text-sm font-black text-emerald-400">{nextEligibleDate}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
