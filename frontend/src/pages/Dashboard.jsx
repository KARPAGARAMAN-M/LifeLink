import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkDonorStatus, getMyDonorProfile, toggleAvailability } from '../api/donorApi';
import { getMyRequests, getDonorRequests } from '../api/requestApi';
import { BloodGroupBadge, StatusBadge, AvailabilityBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import {
  Heart,
  Droplet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building2,
  ToggleLeft,
  ToggleRight,
  Activity,
  HeartPulse,
  Bell,
  User,
  LogOut,
  MapPin,
  Settings,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isDonor, setIsDonor] = useState(false);
  const [donorProfile, setDonorProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);
  const [toggling, setToggling] = useState(false);

  const loadDashboard = async () => {
    try {
      const checkRes = await checkDonorStatus().catch(() => ({ data: { data: false } }));
      const donorStatus = checkRes.data?.data || false;
      setIsDonor(donorStatus);

      if (donorStatus) {
        const profileRes = await getMyDonorProfile().catch(() => null);
        if (profileRes?.data?.data) {
          setDonorProfile(profileRes.data.data);
        }
        const dReqRes = await getDonorRequests().catch(() => ({ data: { data: [] } }));
        setDonorRequests(dReqRes.data?.data || []);
      }

      const myReqRes = await getMyRequests().catch(() => ({ data: { data: [] } }));
      setMyRequests(myReqRes.data?.data || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await toggleAvailability();
      const newAvail = res.data?.data?.availability;
      setDonorProfile((prev) => (prev ? { ...prev, availability: newAvail } : prev));
      toast.success(newAvail ? '🟢 Status set to AVAILABLE' : '🔴 Status set to UNAVAILABLE');
    } catch (err) {
      toast.error('Failed to update availability status');
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const criticalPending = donorRequests.filter(
    (r) => r.status === 'PENDING' && (r.urgency === 'CRITICAL' || r.urgency === 'URGENT')
  );
  const pendingCount = donorRequests.filter((r) => r.status === 'PENDING').length;
  const completedCount = [...myRequests, ...donorRequests].filter((r) => r.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome, <span className="text-red-600 dark:text-red-500">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Donor Command Center & Emergency Activity Overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/request-blood">
              <Button size="sm" variant="danger" icon={AlertCircle} className="font-extrabold shadow-red-600/30">
                Create Request
              </Button>
            </Link>
          </div>
        </div>

        {/* DONOR SPECIFICATION SUMMARY CARD */}
        {isDonor && donorProfile && (
          <Card className="p-6 sm:p-8 border-red-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-black uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-current text-red-400" /> Active Donor Profile
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">Welcome, {donorProfile.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                    <Droplet className="w-3.5 h-3.5 text-red-400" /> Blood Group: <span className="text-red-300 font-black text-sm ml-1">{donorProfile.bloodGroup}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location: <span className="text-white ml-1">{donorProfile.city}, {donorProfile.state}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" /> Last Donation: <span className="text-white ml-1">{donorProfile.lastDonationDate || 'Not recorded'}</span>
                  </span>
                </div>
              </div>

              {/* INSTANT AVAILABILITY SWITCH */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2 text-right">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Donation Availability</p>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-black flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    donorProfile.availability ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {donorProfile.availability ? '🟢 AVAILABLE' : '🔴 UNAVAILABLE'}
                  </span>
                  <button
                    onClick={handleToggleAvailability}
                    disabled={toggling}
                    className="p-1 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                    title="Click to Switch Availability Status"
                  >
                    {donorProfile.availability ? (
                      <ToggleRight className="w-9 h-9 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN ACTION BAR BUTTONS */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 relative z-10">
              <Button
                variant="outline"
                size="sm"
                icon={donorProfile.availability ? ToggleRight : ToggleLeft}
                onClick={handleToggleAvailability}
                className="justify-center text-xs font-bold text-white border-white/20 hover:bg-white/10 py-2.5"
              >
                Change Availability
              </Button>
              <Link to="/request-history">
                <Button
                  variant="outline"
                  size="sm"
                  icon={FileText}
                  className="w-full justify-center text-xs font-bold text-white border-white/20 hover:bg-white/10 py-2.5"
                >
                  Blood Requests
                </Button>
              </Link>
              <Link to="/request-history">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Clock}
                  className="w-full justify-center text-xs font-bold text-white border-white/20 hover:bg-white/10 py-2.5"
                >
                  Donation History
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  icon={User}
                  className="w-full justify-center text-xs font-bold text-white border-white/20 hover:bg-white/10 py-2.5"
                >
                  My Profile
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Settings}
                  className="w-full justify-center text-xs font-bold text-white border-white/20 hover:bg-white/10 py-2.5"
                >
                  Notification Settings
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
                className="justify-center text-xs font-bold py-2.5"
              >
                Logout
              </Button>
            </div>
          </Card>
        )}

        {/* 🚨 CRITICAL EMERGENCY SECTION */}
        {criticalPending.length > 0 && (
          <Card className="p-6 border-red-500/80 bg-red-50/50 dark:bg-red-950/30 shadow-xl space-y-4 animate-pulse-slow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 animate-bounce" />
                <span>Urgent Emergency Requests Requiring Your Attention ({criticalPending.length})</span>
              </div>
              <Link to="/request-history">
                <Button size="sm" variant="danger">
                  Respond Now
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalPending.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BloodGroupBadge group={req.bloodGroup} size="sm" />
                      <StatusBadge urgency={req.urgency} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {req.hospitalName}, {req.city}
                    </p>
                    <p className="text-[11px] text-slate-500">From: {req.requesterName}</p>
                  </div>
                  <Link to="/request-history">
                    <Button size="sm" variant="primary" icon={ArrowRight}>
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Requests & Recommended Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 border-slate-200/80 dark:border-slate-800">
              <CardHeader
                title="Recent Request Activity"
                subtitle="Your latest sent and received blood requests"
                action={
                  <Link
                    to="/request-history"
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                }
              />

              <div className="space-y-4">
                {donorRequests.length === 0 && myRequests.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No active blood requests at the moment. We'll notify you when a matching request is available.
                  </div>
                ) : (
                  [...donorRequests, ...myRequests]
                    .slice(0, 5)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge group={req.bloodGroup} size="sm" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {req.hospitalName}, {req.city}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {req.requesterName ? `Requester: ${req.requesterName}` : `Donor: ${req.donorName}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={req.status} />
                          <StatusBadge urgency={req.urgency} />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
              <CardHeader title="Quick Actions" subtitle="Platform shortcuts" />

              {!isDonor && (
                <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                    <HeartPulse className="w-4 h-4 text-red-600" />
                    <span>Become a Registered Donor</span>
                  </div>
                  <p className="text-[11px] text-red-600 dark:text-red-400">
                    Register your blood group and location to save lives nearby.
                  </p>
                  <Link to="/donor-registration" className="inline-block pt-1">
                    <Button size="sm" variant="danger" icon={UserPlus}>
                      Register Now
                    </Button>
                  </Link>
                </div>
              )}

              <Link to="/search" className="block">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-red-500/50 transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Search className="w-4 h-4 text-red-500" /> Find Available Donors
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500">Search compatible donors by location.</p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
