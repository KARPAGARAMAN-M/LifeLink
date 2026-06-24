import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BLOOD_GROUPS, INDIAN_STATES } from '../utils/constants';
import BloodGroupBadge from '../components/common/BloodGroupBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function SearchDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ bloodGroup: '', city: '', state: '' });
  const [searched, setSearched] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      const res = await api.get(`/donors/search?${params.toString()}`);
      setDonors(res.data.data || []);
    } catch (err) {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mb-3">
            Find <span className="gradient-text">Blood Donors</span>
          </h1>
          <p className="text-surface-500 dark:text-surface-400">Search for available donors by blood group and location</p>
        </div>

        {/* Search Filters */}
        <div className="glass-card p-6 mb-8 animate-slide-up">
          <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-2">
                <FaFilter className="inline mr-1" /> Blood Group
              </label>
              <select value={filters.bloodGroup} onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                className="select-field">
                <option value="">All Groups</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-2">City</label>
              <input value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="input-field" placeholder="Enter city" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-2">State</label>
              <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className="select-field">
                <option value="">All States</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center gap-2">
              <FaSearch /> Search
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Searching donors..." />
        ) : donors.length > 0 ? (
          <>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
              Found <span className="font-bold text-primary-600 dark:text-primary-400">{donors.length}</span> donor(s)
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map(donor => (
                <div key={donor.id} className="glass-card p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{donor.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-surface-900 dark:text-white">{donor.name}</h3>
                        <p className="text-xs text-surface-500">Donor #{donor.id}</p>
                      </div>
                    </div>
                    <BloodGroupBadge bloodGroup={donor.bloodGroup} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary-500 flex-shrink-0" />
                      {donor.city}, {donor.state}
                    </p>
                    <p className="text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2">
                      <FaPhone className="text-primary-500 flex-shrink-0" />
                      {donor.phone}
                    </p>
                    {donor.lastDonationDate && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2">
                        <FaCalendarAlt className="text-primary-500 flex-shrink-0" />
                        Last donated: {new Date(donor.lastDonationDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      donor.availability
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {donor.availability ? '🟢 Available' : '🔴 Unavailable'}
                    </span>
                    {isAuthenticated && donor.availability && (
                      <button
                        onClick={() => navigate(`/request-blood/${donor.id}`)}
                        className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1"
                      >
                        Request Blood <HiArrowRight />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : searched ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-surface-700 dark:text-surface-300 mb-2">No Donors Found</h3>
            <p className="text-surface-500 dark:text-surface-400">Try adjusting your search filters</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
