import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerDonor } from '../api/donorApi';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS, INDIAN_STATES } from '../utils/constants';
import { checkEligibility } from '../utils/eligibilityCalculator';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { BloodGroupBadge } from '../components/common/Badge';
import {
  Droplet,
  MapPin,
  Phone,
  Calendar,
  Heart,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonorRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bloodGroup: '',
    city: '',
    state: '',
    phone: '',
    availability: true,
    lastDonationDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const eligibility = form.lastDonationDate ? checkEligibility(form.lastDonationDate) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bloodGroup) {
      toast.error('Please select your Blood Group');
      return;
    }
    setLoading(true);
    try {
      await registerDonor({
        ...form,
        lastDonationDate: form.lastDonationDate || null,
      });
      toast.success('Donor registration successful! You are now registered to save lives. 🩸');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donor registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" /> Save Lives Today
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Become a <span className="text-red-600 dark:text-red-500">Blood Donor</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Register your blood group and location to receive emergency match requests from patients in need.
          </p>
        </div>

        {/* Form Container */}
        <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader
              title="Donor Registration Details"
              subtitle={`Configuring donor profile for ${user?.name}`}
            />

            {/* Blood Group Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Blood Group *
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setForm({ ...form, bloodGroup: bg })}
                    className={`py-3 rounded-xl border text-sm font-black transition-all flex flex-col items-center justify-center gap-1 ${
                      form.bloodGroup === bg
                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30 scale-105'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500'
                    }`}
                  >
                    <span>{bg}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                icon={MapPin}
                placeholder="e.g. City Name"
                value={form.city}
                onChange={handleChange}
                required
              />

              <Select
                label="State"
                name="state"
                icon={MapPin}
                options={INDIAN_STATES}
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <Input
              label="10-Digit Contact Phone"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="e.g. 9876543210"
              pattern="[0-9]{10}"
              value={form.phone}
              onChange={handleChange}
              required
            />

            {/* Last Donation Date & Eligibility Feedback */}
            <div className="space-y-2">
              <Input
                label="Last Blood Donation Date (Optional)"
                name="lastDonationDate"
                type="date"
                icon={Calendar}
                max={new Date().toISOString().split('T')[0]}
                value={form.lastDonationDate}
                onChange={handleChange}
              />

              {eligibility && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    eligibility.eligible
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {eligibility.eligible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                  <span>{eligibility.message}</span>
                </div>
              )}
            </div>

            {/* Initial Availability Checkbox */}
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <input
                type="checkbox"
                id="donorAvailability"
                name="availability"
                checked={form.availability}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="donorAvailability" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                {form.availability ? '🟢 Mark me as AVAILABLE for emergency requests' : '🔴 Set as UNAVAILABLE initially'}
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon={Droplet}
              isLoading={loading}
              className="w-full py-3.5 font-black text-sm shadow-lg shadow-red-600/30"
            >
              Complete Donor Registration
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
