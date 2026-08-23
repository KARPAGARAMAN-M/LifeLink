import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, getAdminDonors, getAdminRequests, blockUser, unblockUser } from '../api/adminApi';
import { BloodGroupBarChart, BloodGroupPieChart } from '../components/charts/BloodGroupChart';
import { BloodGroupBadge, StatusBadge, AvailabilityBadge } from '../components/common/Badge';
import { CardSkeleton, TableRowSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ConfirmationDialog } from '../components/common/Modal';
import {
  Shield,
  Users,
  Droplet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Lock,
  Unlock,
  Building2,
  FileText,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  ShieldCheck,
  UserX,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview'); // 'overview' | 'users' | 'donors' | 'requests'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  // Search/Filter states
  const [userSearch, setUserSearch] = useState('');
  const [donorSearch, setDonorSearch] = useState('');
  const [requestSearch, setRequestSearch] = useState('');

  // User action modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
    action: null, // 'block' | 'unblock'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, donorsRes, reqsRes] = await Promise.all([
        getAdminStats().catch(() => ({ data: { data: null } })),
        getAdminUsers().catch(() => ({ data: { data: [] } })),
        getAdminDonors().catch(() => ({ data: { data: [] } })),
        getAdminRequests().catch(() => ({ data: { data: [] } })),
      ]);

      setStats(statsRes.data?.data);
      setUsers(usersRes.data?.data || []);
      setDonors(donorsRes.data?.data || []);
      setRequests(reqsRes.data?.data || []);
    } catch (err) {
      toast.error('Failed to retrieve admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerBlockModal = (userItem, block) => {
    setModalState({
      isOpen: true,
      user: userItem,
      action: block ? 'block' : 'unblock',
    });
  };

  const handleConfirmUserBlock = async () => {
    if (!modalState.user) return;
    setActionLoading(true);
    try {
      if (modalState.action === 'block') {
        await blockUser(modalState.user.id);
        toast.success(`User ${modalState.user.name} has been blocked`);
      } else {
        await unblockUser(modalState.user.id);
        toast.success(`User ${modalState.user.name} has been unblocked`);
      }
      setModalState({ isOpen: false, user: null, action: null });
      loadData();
    } catch (err) {
      toast.error(`Action failed: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredDonors = donors.filter(
    (d) =>
      d.name?.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.city?.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.bloodGroup?.toLowerCase().includes(donorSearch.toLowerCase())
  );

  const filteredRequests = requests.filter(
    (r) =>
      r.hospitalName?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.city?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.bloodGroup?.toLowerCase().includes(requestSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Admin Control Center</h1>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-md">
                  Superuser Access
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitor system metrics, manage registered users, donors & emergency requests.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl overflow-x-auto">
          {[
            { id: 'overview', label: 'Analytics Overview', icon: BarChart2 },
            { id: 'users', label: `Users (${users.length})`, icon: Users },
            { id: 'donors', label: `Donors (${donors.length})`, icon: Droplet },
            { id: 'requests', label: `Requests (${requests.length})`, icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  tab === t.id
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{stats?.totalUsers || users.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Platform registrations</p>
                </Card>

                <Card className="p-5 border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Donors</span>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{stats?.activeDonors || donors.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Ready for emergency matches</p>
                </Card>

                <Card className="p-5 border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Requests</span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{stats?.totalRequests || requests.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Hospital & patient requests</p>
                </Card>

                <Card className="p-5 border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fulfilled Matches</span>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{stats?.completedRequests || 0}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Successful blood donations</p>
                </Card>
              </div>
            )}

            {/* Recharts Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6 border-slate-200/80 dark:border-slate-800">
                <CardHeader
                  title="Blood Group Distribution"
                  subtitle="Available donor capacity grouped by blood type"
                />
                <BloodGroupBarChart data={stats?.bloodGroupDistribution} />
              </Card>

              <Card className="p-6 border-slate-200/80 dark:border-slate-800">
                <CardHeader
                  title="Donor Breakdown Ratio"
                  subtitle="Percentage proportion across blood groups"
                />
                <BloodGroupPieChart data={stats?.bloodGroupDistribution} />
              </Card>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardHeader title="User Management" subtitle="Manage access permissions and block suspicious accounts" />
              <div className="w-full sm:w-64">
                <Input
                  icon={Search}
                  placeholder="Search user by name/email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Donor Status</th>
                    <th className="py-3 px-4">Access Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No users matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{u.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs">
                            {u.name?.charAt(0)}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.isDonor ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Donor ({u.bloodGroup})
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              u.isBlocked
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            }`}
                          >
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {u.role !== 'ADMIN' && (
                            <Button
                              size="sm"
                              variant={u.isBlocked ? 'success' : 'danger'}
                              icon={u.isBlocked ? Unlock : Lock}
                              onClick={() => triggerBlockModal(u, !u.isBlocked)}
                            >
                              {u.isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* DONORS TAB */}
        {tab === 'donors' && (
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardHeader title="Donor Directory" subtitle="All registered blood donors across regions" />
              <div className="w-full sm:w-64">
                <Input
                  icon={Search}
                  placeholder="Search donor, city, blood group..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Donor Name</th>
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredDonors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No donors matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDonors.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{d.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{d.name}</td>
                        <td className="py-3.5 px-4">
                          <BloodGroupBadge group={d.bloodGroup} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {d.city}, {d.state}
                        </td>
                        <td className="py-3.5 px-4">
                          <AvailabilityBadge available={d.availability} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* REQUESTS TAB */}
        {tab === 'requests' && (
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardHeader title="All Blood Requests Log" subtitle="Comprehensive audit trail of requests" />
              <div className="w-full sm:w-64">
                <Input
                  icon={Search}
                  placeholder="Search hospital, city, blood group..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Req ID</th>
                    <th className="py-3 px-4">Requester</th>
                    <th className="py-3 px-4">Donor</th>
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Hospital & Location</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No requests matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{r.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.requesterName}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{r.donorName || 'Donor #' + r.donorId}</td>
                        <td className="py-3.5 px-4">
                          <BloodGroupBadge group={r.bloodGroup} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {r.hospitalName}, {r.city}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge urgency={r.urgency} />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Confirmation Modal for Block/Unblock */}
        <ConfirmationDialog
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, user: null, action: null })}
          onConfirm={handleConfirmUserBlock}
          title={modalState.action === 'block' ? `Block Account: ${modalState.user?.name}` : `Unblock Account: ${modalState.user?.name}`}
          message={
            modalState.action === 'block'
              ? `Are you sure you want to block ${modalState.user?.name}? Blocked users will lose access to login and request features.`
              : `Are you sure you want to restore full access for ${modalState.user?.name}?`
          }
          confirmText={modalState.action === 'block' ? 'Block User' : 'Unblock User'}
          variant={modalState.action === 'block' ? 'danger' : 'success'}
          isLoading={actionLoading}
        />
      </div>
    </div>
  );
}
