import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/adminApi';
import { getMyDonorProfile, toggleAvailability } from '../api/donorApi';
import { useAuth } from '../context/AuthContext';
import { BloodGroupBadge, AvailabilityBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import {
  User,
  Mail,
  Lock,
  Calendar,
  Droplet,
  MapPin,
  Phone,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getUserProfile();
      const p = res.data?.data;
      setProfile(p);
      setForm({ name: p?.name || '', currentPassword: '', newPassword: '' });

      if (p?.isDonor) {
        const donorRes = await getMyDonorProfile().catch(() => null);
        if (donorRes?.data?.data) {
          setDonorProfile(donorRes.data.data);
        }
      }
    } catch (err) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await updateUserProfile(payload);
      const updated = res.data?.data;
      setProfile(updated);
      updateUser({ name: updated?.name });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await toggleAvailability();
      const newAvail = res.data?.data?.availability;
      setDonorProfile((prev) => (prev ? { ...prev, availability: newAvail } : prev));
      toast.success(`Availability ${newAvail ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update availability');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" /> Account Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            User <span className="text-red-600 dark:text-red-500">Profile</span>
          </h1>
        </div>

        {/* User Profile Card */}
        <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{profile?.name}</h2>
                <p className="text-xs text-slate-500">{profile?.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                  Role: {profile?.role}
                </span>
              </div>
            </div>

            {!editing && (
              <Button size="sm" variant="secondary" icon={Edit2} onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                label="Current Password (Required for password change)"
                type="password"
                icon={Lock}
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              />

              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="Enter new password (min 6 chars)"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditing(false)} isDisabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <User className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Full Name: <strong>{profile?.name}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Email: <strong>{profile?.email}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Account Created: <strong>{new Date(profile?.createdAt).toLocaleDateString()}</strong></span>
              </div>
            </div>
          )}
        </Card>

        {/* Registered Donor Profile Section */}
        {donorProfile && (
          <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <CardHeader
              title="Registered Donor Details"
              subtitle="Your active blood donation profile specifications"
              action={<BloodGroupBadge group={donorProfile.bloodGroup} size="md" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Location: <strong>{donorProfile.city}, {donorProfile.state}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Phone: <strong>{donorProfile.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>
                  Last Donation Date:{' '}
                  <strong>
                    {donorProfile.lastDonationDate
                      ? new Date(donorProfile.lastDonationDate).toLocaleDateString()
                      : 'N/A / First time'}
                  </strong>
                </span>
              </div>
            </div>

            <CardFooter className="pt-2">
              <div className="flex items-center gap-3">
                <AvailabilityBadge available={donorProfile.availability} />
                <span className="text-xs text-slate-500">
                  {donorProfile.availability ? 'Receiving emergency match alerts' : 'Paused match requests'}
                </span>
              </div>

              <button
                onClick={handleToggleAvailability}
                disabled={toggling}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                {donorProfile.availability ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                <span>Toggle Status</span>
              </button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
