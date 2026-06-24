import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatsCard from '../components/common/StatsCard';
import { BloodGroupBarChart, BloodGroupPieChart } from '../components/charts/BloodGroupChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaUsers, FaTint, FaHandHoldingHeart, FaCheckCircle, FaClock, FaBan, FaUnlock } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import { STATUS_COLORS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, donorsRes, reqsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/donors'),
        api.get('/admin/requests'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setDonors(donorsRes.data.data || []);
      setRequests(reqsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, block) => {
    try {
      await api.put(`/admin/users/${userId}/${block ? 'block' : 'unblock'}`);
      toast.success(`User ${block ? 'blocked' : 'unblocked'} successfully`);
      loadData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: `Users (${users.length})` },
    { id: 'donors', label: `Donors (${donors.length})` },
    { id: 'requests', label: `Requests (${requests.length})` },
  ];

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center shadow-lg">
            <HiShieldCheck className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-surface-500 dark:text-surface-400">Manage users, donors, and blood requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard icon={FaUsers} label="Total Users" value={stats.totalUsers} gradient="from-accent-500 to-accent-700" delay={0} />
              <StatsCard icon={FaTint} label="Total Donors" value={stats.totalDonors} gradient="from-primary-500 to-primary-700" delay={100} />
              <StatsCard icon={FaCheckCircle} label="Active Donors" value={stats.activeDonors} gradient="from-green-500 to-emerald-600" delay={200} />
              <StatsCard icon={FaHandHoldingHeart} label="Total Requests" value={stats.totalRequests} gradient="from-purple-500 to-purple-700" delay={300} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard icon={FaClock} label="Pending" value={stats.pendingRequests} gradient="from-yellow-500 to-orange-500" />
              <StatsCard icon={FaCheckCircle} label="Accepted" value={stats.acceptedRequests} gradient="from-blue-500 to-blue-700" />
              <StatsCard icon={FaCheckCircle} label="Completed" value={stats.completedRequests} gradient="from-emerald-500 to-emerald-700" />
              <StatsCard icon={FaBan} label="Rejected" value={stats.rejectedRequests} gradient="from-red-500 to-red-700" />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">Blood Group Distribution</h3>
                <BloodGroupBarChart data={stats.bloodGroupDistribution} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">Donor Breakdown</h3>
                <BloodGroupPieChart data={stats.bloodGroupDistribution} />
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    {['ID', 'Name', 'Email', 'Role', 'Donor', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-3 text-sm">{u.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-surface-500">{u.email}</td>
                      <td className="px-4 py-3"><span className={`badge ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{u.role}</span></td>
                      <td className="px-4 py-3 text-sm">{u.isDonor ? `✅ ${u.bloodGroup}` : '—'}</td>
                      <td className="px-4 py-3"><span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                      <td className="px-4 py-3">
                        {u.role !== 'ADMIN' && (
                          <button onClick={() => handleBlockUser(u.id, !u.isBlocked)}
                            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                              u.isBlocked ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}>
                            {u.isBlocked ? <><FaUnlock className="inline mr-1" />Unblock</> : <><FaBan className="inline mr-1" />Block</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {tab === 'donors' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    {['ID', 'Name', 'Blood Group', 'City', 'State', 'Phone', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {donors.map(d => (
                    <tr key={d.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-3 text-sm">{d.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{d.name}</td>
                      <td className="px-4 py-3"><span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">🩸 {d.bloodGroup}</span></td>
                      <td className="px-4 py-3 text-sm">{d.city}</td>
                      <td className="px-4 py-3 text-sm">{d.state}</td>
                      <td className="px-4 py-3 text-sm">{d.phone}</td>
                      <td className="px-4 py-3"><span className={`badge ${d.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.availability ? 'Available' : 'Unavailable'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {tab === 'requests' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    {['ID', 'Requester', 'Donor', 'Blood Group', 'Hospital', 'Urgency', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-3 text-sm">{r.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{r.requesterName}</td>
                      <td className="px-4 py-3 text-sm">{r.donorName}</td>
                      <td className="px-4 py-3 text-sm font-bold text-primary-600 dark:text-primary-400">{r.bloodGroup}</td>
                      <td className="px-4 py-3 text-sm">{r.hospitalName}</td>
                      <td className="px-4 py-3"><span className={`${r.urgency === 'CRITICAL' ? 'badge-critical' : r.urgency === 'URGENT' ? 'badge-urgent' : 'badge-normal'}`}>{r.urgency}</span></td>
                      <td className="px-4 py-3"><span className={STATUS_COLORS[r.status]}>{r.status}</span></td>
                      <td className="px-4 py-3 text-xs text-surface-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
