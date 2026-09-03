import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerDonor, registerDonorPublic } from '../api/donorApi';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS, INDIAN_STATES } from '../utils/constants';
import useGeolocation from '../utils/useGeolocation';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import {
  Droplet,
  MapPin,
  Phone,
  Calendar,
  Heart,
  User,
  Mail,
  Lock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonorRegistration() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const geo = useGeolocation();

  const [loading, setLoading] = useState(false);
  const [submittedDisclaimer, setSubmittedDisclaimer] = useState(false);

  // ALL FIELDS INITIALLY EMPTY AS PER SPECIFICATION
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    age: '',
    gender: '',
    phone: '',
    bloodGroup: '',
    rhFactor: 'Positive (+)',
    city: '',
    district: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
    availability: true, // Default: YES, I'M WILLING TO DONATE
    lastDonationDate: '',
    screeningAnswers: {
      feelingHealthy: true,
      donatedRecently: false,
      doctorAdvice: false,
      takingMedications: false,
      recentIllness: false,
      hasFever: false,
      tattooOrPiercing: false,
      pregnantOrPostpartum: false,
      ineligibleHistory: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'dob' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setForm({ ...form, dob: value, age: age > 0 ? age : '' });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleScreeningChange = (key, val) => {
    setForm((prev) => ({
      ...prev,
      screeningAnswers: {
        ...prev.screeningAnswers,
        [key]: val,
      },
    }));
  };

  const handleUseLocation = () => {
    geo.requestLocation();
    if (geo.latitude && geo.longitude) {
      setForm((prev) => ({
        ...prev,
        latitude: geo.latitude,
        longitude: geo.longitude,
      }));
      toast.success('Current coordinates auto-filled!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bloodGroup) {
      toast.error('Please select your Blood Group');
      return;
    }

    if (!user) {
      if (!form.name || !form.email || !form.password) {
        toast.error('Please complete full name, email, and password');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        dob: form.dob || null,
        age: form.age ? parseInt(form.age, 10) : null,
        gender: form.gender || 'Unspecified',
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        rhFactor: form.rhFactor,
        city: form.city,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        latitude: geo.latitude || form.latitude,
        longitude: geo.longitude || form.longitude,
        availability: form.availability,
        lastDonationDate: form.lastDonationDate || null,
        screeningAnswers: JSON.stringify(form.screeningAnswers),
      };

      if (user) {
        await registerDonor(payload);
      } else {
        await registerDonorPublic(payload);
      }

      setSubmittedDisclaimer(true);
      toast.success('Donor Registration Saved Successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donor registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current text-red-600" /> Become a Blood Donor
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Donor <span className="text-red-600 dark:text-red-500">Registration</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Register your blood group and location to receive emergency match requests from patients in need.
          </p>
        </div>

        {/* Successful Disclaimer Overlay Box */}
        {submittedDisclaimer ? (
          <Card className="p-8 border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Information Has Been Recorded</h2>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-left space-y-2 shadow-sm">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-500" /> Mandatory Health Advisory:
                </p>
                <p>
                  Donation eligibility can depend on your current health, medical history, local blood-bank rules, and screening.
                </p>
                <p className="font-bold text-red-600 dark:text-red-400">
                  Please confirm your eligibility with a qualified blood-bank professional before donating.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/login">
                <Button variant="primary" className="font-black px-6 py-3 shadow-lg shadow-red-600/30">
                  Proceed to Donor Login
                </Button>
              </Link>
              <Link to="/">
                <Button variant="secondary" className="font-bold px-6 py-3">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Multi-Section Form */
          <Card className="p-6 sm:p-10 border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                  <User className="w-4 h-4" /> 1. Personal Information
                </div>

                {!user && (
                  <div className="space-y-4">
                    <Input
                      label="Full Name *"
                      name="name"
                      icon={User}
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Email Address *"
                        name="email"
                        type="email"
                        icon={Mail}
                        placeholder="e.g. rahul@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />

                      <Input
                        label="Phone Number *"
                        name="phone"
                        type="tel"
                        icon={Phone}
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Password *"
                        name="password"
                        type="password"
                        icon={Lock}
                        placeholder="Create strong password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />

                      <Input
                        label="Confirm Password *"
                        name="confirmPassword"
                        type="password"
                        icon={Lock}
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {user && (
                  <Input
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    icon={Phone}
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Date of Birth *"
                    name="dob"
                    type="date"
                    icon={Calendar}
                    max={new Date().toISOString().split('T')[0]}
                    value={form.dob}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Calculated Age"
                    name="age"
                    type="number"
                    placeholder="Auto-computed"
                    value={form.age}
                    readOnly
                    className="bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
                  />

                  <Select
                    label="Gender *"
                    name="gender"
                    options={['Male', 'Female', 'Other', 'Prefer not to say']}
                    value={form.gender}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* SECTION 2: BLOOD INFORMATION */}
              <div className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                    <Droplet className="w-4 h-4" /> 2. Blood Information
                  </div>
                  <span className="text-[11px] text-slate-400">Select group & Rh factor</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Blood Group *
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setForm({ ...form, bloodGroup: bg })}
                        className={`py-3 rounded-xl border text-sm font-black transition-all flex items-center justify-center ${
                          form.bloodGroup === bg
                            ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30 scale-105'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Select
                    label="Rh Factor"
                    name="rhFactor"
                    options={['Positive (+)', 'Negative (-)']}
                    value={form.rhFactor}
                    onChange={handleChange}
                  />

                  <Input
                    label="Last Blood Donation Date (Optional)"
                    name="lastDonationDate"
                    type="date"
                    icon={Calendar}
                    max={new Date().toISOString().split('T')[0]}
                    value={form.lastDonationDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* SECTION 3: LOCATION DETAILS */}
              <div className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                    <MapPin className="w-4 h-4" /> 3. Location Details
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={Navigation}
                    onClick={handleUseLocation}
                    className="text-xs border-red-500/40 text-red-600 dark:text-red-400"
                  >
                    📍 Use My Current Location
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City *"
                    name="city"
                    icon={MapPin}
                    placeholder="e.g. Salem / Chennai"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="District"
                    name="district"
                    icon={MapPin}
                    placeholder="e.g. Salem District"
                    value={form.district}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="State *"
                    name="state"
                    icon={MapPin}
                    options={INDIAN_STATES}
                    value={form.state}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    placeholder="e.g. 636001"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Exact residential street addresses are kept private. Public search shows only City/District distance.
                </p>
              </div>

              {/* SECTION 4: BASIC DONOR HEALTH SCREENING */}
              <div className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                  <Stethoscope className="w-4 h-4" /> 4. Basic Donor Health Screening
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Please answer the following self-screening questions truthfully:
                  </p>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'feelingHealthy', label: 'Are you currently feeling healthy and well?' },
                      { key: 'donatedRecently', label: 'Have you donated blood within the last 56 days?' },
                      { key: 'doctorAdvice', label: 'Have you ever been told by a doctor not to donate blood?' },
                      { key: 'takingMedications', label: 'Are you currently taking any prescription medications?' },
                      { key: 'recentIllness', label: 'Have you recently had a significant illness, infection, or surgery?' },
                      { key: 'hasFever', label: 'Do you currently have a fever or feel unwell?' },
                      { key: 'tattooOrPiercing', label: 'Have you received a tattoo or piercing in the last 6 months?' },
                      { key: 'pregnantOrPostpartum', label: 'Are you currently pregnant or recently given birth (if applicable)?' },
                    ].map((q) => (
                      <div key={q.key} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-700 dark:text-slate-300">{q.label}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleScreeningChange(q.key, true)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              form.screeningAnswers[q.key]
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => handleScreeningChange(q.key, false)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              !form.screeningAnswers[q.key]
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: AVAILABILITY SELECTION */}
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Would you like to receive emergency blood donation requests?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, availability: true })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      form.availability
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">YES, I'M WILLING TO DONATE</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Set status as AVAILABLE (🟢). You can change this switch anytime from your dashboard.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, availability: false })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      !form.availability
                        ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 ring-2 ring-slate-500/30'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">NOT NOW</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Set status as UNAVAILABLE (🔴). You will not be listed in public search results.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                icon={Droplet}
                isLoading={loading}
                className="w-full py-4 font-black text-base shadow-xl shadow-red-600/40"
              >
                Submit Donor Registration
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
