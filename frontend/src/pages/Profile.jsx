import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Heart,
  Droplet,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Profile() {
  const { user, isDonor, isSeeker, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', state: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/me');
      const u = res.data?.data;
      setProfile(u);
      setForm({
        name: u?.name || '',
        phone: u?.phone || '',
        city: u?.city || '',
        state: u?.state || '',
      });

      if (isDonor) {
        const donorRes = await api.get('/donors/my-profile').catch(() => null);
        if (donorRes?.data?.data) {
          setDonorProfile(donorRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      const updated = res.data?.data;
      setProfile(updated);
      updateUser({ name: updated?.name });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await api.patch('/donors/availability');
      setDonorProfile(res.data?.data || donorProfile);
    } catch (err) {
      alert('Failed to update availability.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile details..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isDonor ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-red-950 text-red-300 border border-red-800'
          }`}>
            {isDonor ? <Heart className="w-4 h-4 text-rose-500 fill-current" /> : <Droplet className="w-4 h-4 text-red-500 fill-current" />}
            <span>{isDonor ? 'Blood Donor Profile' : 'Blood Seeker Profile'}</span>
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight">Account Settings & Profile</h1>
          <p className="text-xs text-slate-400">Manage your personal information and contact details.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl text-white font-black text-2xl flex items-center justify-center shadow-lg ${
                isDonor ? 'bg-gradient-to-tr from-rose-600 to-red-600' : 'bg-gradient-to-tr from-red-600 to-amber-600'
              }`}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{profile?.name}</h2>
                <p className="text-xs text-slate-400">{profile?.email}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-black uppercase rounded ${
                  isDonor ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  ROLE: {profile?.role || user?.role}
                </span>
              </div>
            </div>

            {!editing && (
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Phone Number</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">City</label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">State / Region</label>
                  <Input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button variant="danger" type="submit" loading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-extrabold uppercase">Full Name</span>
                <p className="text-sm font-bold text-white">{profile?.name}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-extrabold uppercase">Email Address</span>
                <p className="text-sm font-bold text-white">{profile?.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-extrabold uppercase">Phone Number</span>
                <p className="text-sm font-bold text-white">{profile?.phone || donorProfile?.phone || 'Not Provided'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-extrabold uppercase">Location</span>
                <p className="text-sm font-bold text-white">
                  {profile?.city || donorProfile?.city || 'Local'}, {profile?.state || donorProfile?.state || 'State'}
                </p>
              </div>

              {/* Donor Specific Details */}
              {isDonor && donorProfile && (
                <>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-extrabold uppercase">Blood Group</span>
                    <p className="text-sm font-bold text-rose-400">{donorProfile.bloodGroup}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-extrabold uppercase">Date of Birth</span>
                    <p className="text-sm font-bold text-white">{donorProfile.dob || 'Not Recorded'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-extrabold uppercase">Last Donation Date</span>
                    <p className="text-sm font-bold text-white">{donorProfile.lastDonationDate || 'None'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-extrabold uppercase">Availability</span>
                      <p className={`text-sm font-bold ${donorProfile.availability ? 'text-emerald-400' : 'text-red-400'}`}>
                        {donorProfile.availability ? '🟢 Available' : '🔴 Unavailable'}
                      </p>
                    </div>
                    <button onClick={handleToggleAvailability} className="text-slate-400 hover:text-white">
                      {donorProfile.availability ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-500" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
