import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkDonorStatus, getMyDonorProfile, toggleAvailability } from '../api/donorApi';
import { getMyRequests, getDonorRequests } from '../api/requestApi';
import { BloodGroupBadge, StatusBadge, AvailabilityBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDonor, setIsDonor] = useState(false);
  const [donorProfile, setDonorProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);
  const [toggling, setToggling] = useState(false);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
      toast.success(newAvail ? 'You are now marked as AVAILABLE for blood requests' : 'Status set to UNAVAILABLE');
    } catch (err) {
      toast.error('Failed to update availability status');
    } finally {
      setToggling(false);
    }
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

  // Filter emergency & critical pending requests
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
              {getTimeGreeting()}, <span className="text-red-600 dark:text-red-500">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here's your LifeLink emergency activity overview.
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

        {/* Top Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sent Requests</span>
              <div className="p-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <Droplet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{myRequests.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Total requests dispatched</p>
          </Card>

          <Card className="p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Actions</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{pendingCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting donor response</p>
          </Card>

          <Card className="p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Matches Completed</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{completedCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Lives impacted</p>
          </Card>

          {/* Donor status toggle card */}
          <Card className="p-5 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Donor Status</span>
              {donorProfile && <BloodGroupBadge group={donorProfile.bloodGroup} size="sm" />}
            </div>

            {isDonor ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <AvailabilityBadge available={donorProfile?.availability} />
                  <button
                    onClick={handleToggleAvailability}
                    disabled={toggling}
                    className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors"
                    title="Toggle Availability"
                  >
                    {donorProfile?.availability ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <Link to="/donor-registration">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                    Register as Donor <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            )}
          </Card>
        </div>

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

        {/* Main Content Grid: Activity Timeline & Recommended Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recent Activity & Requests */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 border-slate-200/80 dark:border-slate-800">
              <CardHeader
                title="Recent Request Activity"
                subtitle="Your latest sent and received blood requests"
                action={
                  <Link
                    to="/request-history"
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                }
              />

              <div className="space-y-4">
                {donorRequests.length === 0 && myRequests.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No requests recorded yet. Create an emergency blood request or register as a donor.
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

          {/* Right Column: Recommended Actions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
              <CardHeader title="Recommended Actions" subtitle="Next steps to keep your account active" />

              {!isDonor && (
                <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                    <HeartPulse className="w-4 h-4 text-red-600" />
                    <span>Become a Registered Donor</span>
                  </div>
                  <p className="text-[11px] text-red-600 dark:text-red-400">
                    Help nearby patients by adding your blood group and location.
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

              <Link to="/request-blood" className="block">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-red-500/50 transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-red-500" /> Emergency Request
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500">Create urgent hospital request for a patient.</p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
