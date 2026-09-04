import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Activity,
  ArrowRight,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Droplet
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DonorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donorProfile, setDonorProfile] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorDashboardData();
  }, []);

  const fetchDonorDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch donor profile
      const profRes = await api.get('/donors/my-profile');
      setDonorProfile(profRes.data?.data || null);

      // Fetch incoming requests for this donor
      const reqRes = await api.get('/requests/donor-requests');
      setIncomingRequests(reqRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch donor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await api.patch('/donors/availability');
      setDonorProfile(res.data?.data || donorProfile);
    } catch (err) {
      alert('Failed to update availability status.');
    }
  };

  const pendingRequests = incomingRequests.filter(r => r.status === 'PENDING');
  const emergencyRequests = pendingRequests.filter(r => r.urgency === 'CRITICAL' || r.urgency === 'URGENT');

  // Calculate Next Eligible Donation Date (56 days after last donation)
  let nextEligibleDate = 'Eligible Now';
  if (donorProfile?.lastDonationDate) {
    const lastDate = new Date(donorProfile.lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 56);
    nextEligibleDate = nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (loading) return <LoadingSpinner text="Loading Donor Dashboard..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/70 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-xs font-black uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
                <span>Donor Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                Welcome, {user?.name || 'Donor'} ❤️
              </h1>
              <p className="text-sm text-slate-400 font-medium max-w-xl">
                Your availability can help save a life. Review incoming requests and keep your donor profile up to date.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/donor/requests">
                <Button variant="primary" size="lg" icon={FileText} className="font-black bg-gradient-to-r from-rose-600 to-red-600 shadow-lg shadow-rose-600/30">
                  📩 VIEW BLOOD REQUESTS ({pendingRequests.length})
                </Button>
              </Link>
              <Link to="/donor/availability">
                <Button variant="secondary" size="lg" icon={Activity} className="font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700">
                  🟢 MANAGE AVAILABILITY
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Key Donor Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Blood Group */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Blood Group</p>
              <h3 className="text-3xl font-black text-white mt-1">{donorProfile?.bloodGroup || 'O+'}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Verified Universal Match</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 font-black text-xl flex items-center justify-center shadow-lg">
              {donorProfile?.bloodGroup || 'O+'}
            </div>
          </div>

          {/* Card 2: Availability Status */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Availability</p>
              <h3 className={`text-2xl font-black mt-1 ${donorProfile?.availability ? 'text-emerald-400' : 'text-red-400'}`}>
                {donorProfile?.availability ? '🟢 AVAILABLE' : '🔴 UNAVAILABLE'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {donorProfile?.availability ? 'Visible in Seeker Searches' : 'Hidden from Search Results'}
              </p>
            </div>
            <button
              onClick={handleToggleAvailability}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Toggle Availability"
            >
              {donorProfile?.availability ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-500" />
              )}
            </button>
          </div>

          {/* Card 3: Eligibility Status */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Eligibility Status</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-6 h-6" /> ELIGIBLE
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Ready for next donation</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>

          {/* Card 4: Pending Blood Requests */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Pending Requests</p>
              <h3 className="text-3xl font-black text-white mt-1">{pendingRequests.length}</h3>
              <p className="text-[11px] text-amber-400 font-semibold mt-1">
                {emergencyRequests.length} Emergency Alerts
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold">
              <FileText className="w-7 h-7" />
            </div>
          </div>

          {/* Card 5: Last Donation Date */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Last Donation Date</p>
              <h3 className="text-lg font-black text-white mt-1">
                {donorProfile?.lastDonationDate || 'Not Recorded Yet'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Donation Log</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
          </div>

          {/* Card 6: Next Eligible Donation Date */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Next Eligible Date</p>
              <h3 className="text-lg font-black text-emerald-400 mt-1">{nextEligibleDate}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Based on 56-day cycle</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>

        </div>

        {/* Incoming Requests Triage Preview Section */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Incoming Blood Requests</h2>
              <p className="text-xs text-slate-400">Requests matching your blood group and location</p>
            </div>
            <Link to="/donor/requests" className="text-xs font-extrabold text-rose-400 hover:text-rose-300 flex items-center gap-1">
              View All Requests →
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">All Caught Up!</h3>
              <p className="text-xs text-slate-500">There are no pending blood requests assigned to your donor profile right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                    req.urgency === 'CRITICAL' || req.urgency === 'URGENT'
                      ? 'bg-red-950/40 border-red-800'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded ${
                        req.urgency === 'CRITICAL' || req.urgency === 'URGENT'
                          ? 'bg-red-900 text-red-200 border border-red-700'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {req.urgency === 'CRITICAL' ? '🚨 EMERGENCY REQUEST' : '📩 NORMAL REQUEST'}
                      </span>
                      <span className="text-xs font-black text-rose-400">{req.bloodGroup}</span>
                    </div>

                    <h4 className="text-base font-black text-white">{req.hospitalName}</h4>
                    <p className="text-xs text-slate-300">
                      Location: <strong>{req.city}</strong> • Required Units: <strong>{req.unitsRequired}</strong>
                    </p>
                    <p className="text-xs text-slate-400">
                      Requester: {req.requesterName}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link to="/donor/requests">
                      <Button size="sm" variant="primary" className="w-full justify-center text-xs font-extrabold bg-rose-600 hover:bg-rose-500">
                        Review Request
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
