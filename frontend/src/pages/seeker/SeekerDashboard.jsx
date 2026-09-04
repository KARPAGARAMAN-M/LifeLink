import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Search,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users,
  Droplet,
  FileText,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Heart,
  MapPin
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [nearbyDonorsCount, setNearbyDonorsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch seeker's own requests
      const reqRes = await api.get('/requests/my-requests');
      setRequests(reqRes.data?.data || []);

      // Fetch donor search count summary
      const donorRes = await api.get('/donors/search');
      setNearbyDonorsCount((donorRes.data?.data || []).length);
    } catch (err) {
      console.error('Failed to fetch seeker dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED');
  const emergencyRequests = requests.filter(r => r.urgency === 'CRITICAL' || r.urgency === 'URGENT');

  if (loading) return <LoadingSpinner text="Loading Seeker Dashboard..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/60 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-black uppercase tracking-wider">
                <Droplet className="w-3.5 h-3.5 fill-current text-red-500" />
                <span>Seeker Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome back, {user?.name || 'Seeker'}
              </h1>
              <p className="text-sm text-slate-400 font-medium max-w-xl">
                Find the right donor when every second matters. Manage your active blood requests and search verified donors.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/seeker/find-blood">
                <Button variant="danger" size="lg" icon={Search} className="font-black shadow-lg shadow-red-600/30">
                  🔎 FIND BLOOD
                </Button>
              </Link>
              <Link to="/seeker/emergency-request">
                <Button variant="secondary" size="lg" icon={AlertCircle} className="font-black bg-red-950 hover:bg-red-900 text-red-200 border border-red-800">
                  🚨 EMERGENCY REQUEST
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Core Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Active Requests */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Requests</p>
              <h3 className="text-3xl font-black text-white">{activeRequests.length}</h3>
              <p className="text-[11px] text-amber-400 font-semibold mt-0.5">Pending & Matched</p>
            </div>
          </div>

          {/* Card 2: Matching Donors */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Matching Donors</p>
              <h3 className="text-3xl font-black text-white">{nearbyDonorsCount}</h3>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Available in network</p>
            </div>
          </div>

          {/* Card 3: Emergency Requests */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Emergency Requests</p>
              <h3 className="text-3xl font-black text-white">{emergencyRequests.length}</h3>
              <p className="text-[11px] text-red-400 font-semibold mt-0.5">High Urgency</p>
            </div>
          </div>

          {/* Card 4: Nearby Available Donors */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center font-bold">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Nearby Donors</p>
              <h3 className="text-3xl font-black text-white">{nearbyDonorsCount}</h3>
              <p className="text-[11px] text-blue-400 font-semibold mt-0.5">Within search radius</p>
            </div>
          </div>

        </div>

        {/* Quick Access Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Requests List Section */}
          <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Your Blood Requests</h2>
                <p className="text-xs text-slate-400">Track and manage your created requests</p>
              </div>
              <Link to="/seeker/my-requests" className="text-xs font-extrabold text-red-400 hover:text-red-300 flex items-center gap-1">
                View All ({requests.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-300">No Blood Requests Yet</h3>
                  <p className="text-xs text-slate-500 mt-1">Need blood for yourself or someone else? Search for donors or post an emergency request.</p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link to="/seeker/find-blood">
                    <Button size="sm" variant="danger" icon={Search}>
                      Find Blood Near Me
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-950 text-red-400 border border-red-800 font-black text-sm flex items-center justify-center">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{req.hospitalName}</h4>
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                            req.urgency === 'CRITICAL' || req.urgency === 'URGENT' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {req.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {req.city} • Units Required: {req.unitsRequired} • Target Donor: {req.donorName || 'Broadcast'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <span className={`px-3 py-1 text-xs font-black uppercase rounded-full ${
                        req.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        req.status === 'PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        req.status === 'CANCELLED' ? 'bg-slate-800 text-slate-400' : 'bg-red-950 text-red-400'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Seeker Guide */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white">How Blood Seeker Portal Works</h3>
              
              <div className="space-y-4 text-xs font-medium text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-red-950 text-red-400 font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <p><strong className="text-white">Search Available Donors:</strong> Filter by blood group and radius to find donors near you.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-red-950 text-red-400 font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <p><strong className="text-white">Send Blood Request:</strong> Dispatch normal or emergency requests directly to compatible donors.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-red-950 text-red-400 font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <p><strong className="text-white">Track & Contact:</strong> Receive instant notification when a donor accepts and communicate safely.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>Donor Privacy & Safety</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Donor exact locations are kept confidential. You will receive direct phone contact once a donor approves your request.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
