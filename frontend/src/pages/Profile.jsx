import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaUser, FaEnvelope, FaTint, FaMapMarkerAlt, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data.data);
      setForm({ name: res.data.data.name, currentPassword: '', newPassword: '' });

      if (res.data.data.isDonor) {
        const donorRes = await api.get('/donors/my-profile');
        setDonorProfile(donorRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await api.put('/users/profile', payload);
      setProfile(res.data.data);
      updateUser({ name: res.data.data.name });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await api.patch('/donors/availability');
      setDonorProfile(res.data.data);
      toast.success(`Availability ${res.data.data.availability ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update availability');
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="glass-card p-8 mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">{profile?.name?.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white">{profile?.name}</h2>
              <p className="text-surface-500 dark:text-surface-400">{profile?.email}</p>
              <span className={`badge mt-1 ${profile?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {profile?.role}
              </span>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Current Password (for password change)</label>
                <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  className="input-field" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">New Password</label>
                <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="input-field" placeholder="Enter new password (min 6 chars)" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaUser className="text-primary-500" /> <span>{profile?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaEnvelope className="text-primary-500" /> <span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaCalendarAlt className="text-primary-500" /> <span>Joined: {new Date(profile?.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <button onClick={() => setEditing(true)} className="btn-secondary mt-4">Edit Profile</button>
            </div>
          )}
        </div>

        {/* Donor Profile */}
        {donorProfile && (
          <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
              <FaTint className="text-primary-500" /> Donor Profile
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaTint className="text-primary-500" /> Blood Group: <strong>{donorProfile.bloodGroup}</strong>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaMapMarkerAlt className="text-primary-500" /> {donorProfile.city}, {donorProfile.state}
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaPhone className="text-primary-500" /> {donorProfile.phone}
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <FaCalendarAlt className="text-primary-500" /> Last: {donorProfile.lastDonationDate ? new Date(donorProfile.lastDonationDate).toLocaleDateString('en-IN') : 'N/A'}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className={`badge ${donorProfile.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {donorProfile.availability ? '🟢 Available' : '🔴 Unavailable'}
              </span>
              <button onClick={handleToggleAvailability} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Toggle Availability
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
