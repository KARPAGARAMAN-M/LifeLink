import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaUsers, FaTint, FaHandHoldingHeart, FaClock, FaCheckCircle, FaSearch, FaUserPlus } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { STATUS_COLORS, URGENCY_COLORS } from '../utils/constants';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDonor, setIsDonor] = useState(false);
  const [donorProfile, setDonorProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Check donor status
      const checkRes = await api.get('/donors/check');
      const donorStatus = checkRes.data.data;
      setIsDonor(donorStatus);

      if (donorStatus) {
        const profileRes = await api.get('/donors/my-profile');
        setDonorProfile(profileRes.data.data);
        const dReqRes = await api.get('/requests/donor-requests');
        setDonorRequests(dReqRes.data.data || []);
      }

      // My sent requests
      const myReqRes = await api.get('/requests/my-requests');
      setMyRequests(myReqRes.data.data || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const pendingDonorRequests = donorRequests.filter(r => r.status === 'PENDING').length;
  const completedRequests = [...myRequests, ...donorRequests].filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name}</span> 👋
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Here's an overview of your LifeLink activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={FaTint} label="Requests Sent" value={myRequests.length} gradient="from-primary-500 to-primary-700" delay={0} />
          <StatsCard icon={FaClock} label="Pending" value={pendingDonorRequests} gradient="from-yellow-500 to-orange-500" delay={100} />
          <StatsCard icon={FaCheckCircle} label="Completed" value={completedRequests} gradient="from-green-500 to-emerald-600" delay={200} />
          <StatsCard icon={FaHandHoldingHeart} label="Requests Received" value={donorRequests.length} gradient="from-accent-500 to-accent-700" delay={300} />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/search" className="glass-card p-5 card-hover flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaSearch className="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-surface-900 dark:text-white">Find Donors</h3>
              <p className="text-sm text-surface-500">Search available donors</p>
            </div>
            <HiArrowRight className="text-surface-400 group-hover:text-primary-500 transition-colors" />
          </Link>

          {!isDonor ? (
            <Link to="/donor-registration" className="glass-card p-5 card-hover flex items-center gap-4 group">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaUserPlus className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-surface-900 dark:text-white">Become a Donor</h3>
                <p className="text-sm text-surface-500">Register to save lives</p>
              </div>
              <HiArrowRight className="text-surface-400 group-hover:text-green-500 transition-colors" />
            </Link>
          ) : (
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white">Registered Donor</h3>
                <p className="text-sm text-surface-500">Blood Group: <strong>{donorProfile?.bloodGroup}</strong> • {donorProfile?.availability ? '🟢 Available' : '🔴 Unavailable'}</p>
              </div>
            </div>
          )}

          <Link to="/request-history" className="glass-card p-5 card-hover flex items-center gap-4 group">
            <div className="w-12 h-12 bg-accent-50 dark:bg-accent-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaUsers className="text-accent-600 dark:text-accent-400 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-surface-900 dark:text-white">Request History</h3>
              <p className="text-sm text-surface-500">View all requests</p>
            </div>
            <HiArrowRight className="text-surface-400 group-hover:text-accent-500 transition-colors" />
          </Link>
        </div>

        {/* Recent Requests */}
        {donorRequests.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4">Incoming Requests</h2>
            <div className="space-y-3">
              {donorRequests.slice(0, 5).map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <FaTint className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">{req.requesterName}</p>
                      <p className="text-xs text-surface-500">{req.bloodGroup} • {req.hospitalName}, {req.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={URGENCY_COLORS[req.urgency] || 'badge-normal'}>{req.urgency}</span>
                    <span className={STATUS_COLORS[req.status] || 'badge-pending'}>{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {myRequests.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4">My Sent Requests</h2>
            <div className="space-y-3">
              {myRequests.slice(0, 5).map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">To: {req.donorName}</p>
                    <p className="text-xs text-surface-500">{req.bloodGroup} • {req.hospitalName}</p>
                  </div>
                  <span className={STATUS_COLORS[req.status] || 'badge-pending'}>{req.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
