import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonorById } from '../api/donorApi';
import { createBloodRequest, createEmergencyBloodRequest } from '../api/requestApi';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../utils/constants';
import { BloodGroupBadge, StatusBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import {
  Droplet,
  Building2,
  MapPin,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  UserCheck,
  ShieldAlert,
  User,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestBlood() {
  const { donorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [step, setStep] = useState(1);
  const [donor, setDonor] = useState(null);
  const [loadingDonor, setLoadingDonor] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    donorId: donorId || '',
    bloodGroup: '',
    hospitalName: '',
    city: '',
    urgency: 'CRITICAL',
    requesterName: '',
    requesterPhone: '',
    message: '',
  });

  useEffect(() => {
    if (donorId) {
      setLoadingDonor(true);
      getDonorById(donorId)
        .then((res) => {
          const d = res.data?.data;
          if (d) {
            setDonor(d);
            setForm((prev) => ({
              ...prev,
              donorId: d.id,
              bloodGroup: d.bloodGroup || prev.bloodGroup,
              city: d.city || prev.city,
            }));
          }
        })
        .catch(() => toast.error('Donor details could not be loaded'))
        .finally(() => setLoadingDonor(false));
    }
  }, [donorId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.donorId) {
        toast.error('Please enter or select a valid Donor ID');
        return;
      }
      if (!form.bloodGroup) {
        toast.error('Please select the required Blood Group');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.hospitalName || !form.city) {
        toast.error('Hospital Name and City are required');
        return;
      }
      if (!isAuthenticated && (!form.requesterName || !form.requesterPhone)) {
        toast.error('Your Name and Phone Number are required so the donor can reach you');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAuthenticated) {
        await createBloodRequest(form);
        toast.success('Emergency blood request dispatched successfully! 🩸');
        navigate('/request-history');
      } else {
        await createEmergencyBloodRequest(form);
        toast.success('Emergency blood request dispatched to donor! 🩸');
        navigate('/search');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit blood request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Dispatch Wizard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Blood <span className="text-red-600 dark:text-red-500">Request</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Submit a direct request to compatible donors or specified medical centers.
          </p>
        </div>

        {/* Selected Donor Preview Card */}
        {loadingDonor ? (
          <CardSkeleton />
        ) : donor ? (
          <Card className="p-5 border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black flex items-center justify-center">
                  {donor.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{donor.name}</h4>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {donor.city}, {donor.state}
                  </p>
                </div>
              </div>
              <BloodGroupBadge group={donor.bloodGroup} size="md" />
            </div>
          </Card>
        ) : null}

        {/* Wizard Progress Bar */}
        <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step >= s
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-4 ring-red-100 dark:ring-red-950'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        {/* Step Form Container */}
        <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 shadow-xl">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <CardHeader
                title="Step 1: Blood Requirement"
                subtitle="Select target donor ID, blood group and urgency level"
              />

              {!donorId && (
                <Input
                  label="Target Donor ID"
                  name="donorId"
                  type="number"
                  placeholder="Enter numeric donor ID (e.g. 1)"
                  value={form.donorId}
                  onChange={handleChange}
                  required
                />
              )}

              <Select
                label="Required Blood Group"
                name="bloodGroup"
                icon={Droplet}
                options={BLOOD_GROUPS}
                value={form.bloodGroup}
                onChange={handleChange}
                required
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Urgency Status *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {URGENCY_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setForm({ ...form, urgency: lvl })}
                      className={`p-3 rounded-xl border text-xs font-black tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        form.urgency === lvl
                          ? lvl === 'CRITICAL'
                            ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30 animate-pulse'
                            : lvl === 'URGENT'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-lg'
                            : 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" icon={ArrowRight}>
                  Next: Hospital Details
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <CardHeader
                title="Step 2: Hospital & Location Info"
                subtitle="Provide medical center details where blood is needed"
              />

              {!isAuthenticated && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                  <Input
                    label="Your Full Name *"
                    name="requesterName"
                    icon={User}
                    placeholder="e.g. Ramesh Kumar"
                    value={form.requesterName}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Your Contact Phone *"
                    name="requesterPhone"
                    icon={Phone}
                    placeholder="e.g. +91 9876543210"
                    value={form.requesterPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <Input
                label="Hospital Name"
                name="hospitalName"
                icon={Building2}
                placeholder="e.g. City General Hospital"
                value={form.hospitalName}
                onChange={handleChange}
                required
              />

              <Input
                label="City / Location"
                name="city"
                icon={MapPin}
                placeholder="e.g. San Francisco / Chennai"
                value={form.city}
                onChange={handleChange}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Additional Notes / Patient Condition (Optional)
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Provide additional details regarding ward, room number, or doctor contact..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" icon={ArrowRight}>
                  Next: Review & Dispatch
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <CardHeader
                title="Step 3: Review Request Summary"
                subtitle="Please confirm all details before broadcasting to donor"
              />

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Blood Group Needed</span>
                  <BloodGroupBadge group={form.bloodGroup} size="sm" />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Urgency Level</span>
                  <StatusBadge urgency={form.urgency} />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Hospital</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{form.hospitalName}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Location</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{form.city}</span>
                </div>

                {form.message && (
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Notes</span>
                    <p className="text-xs italic text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      "{form.message}"
                    </p>
                  </div>
                )}
              </div>

              {form.urgency === 'CRITICAL' && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-semibold">
                    This is flagged as a <strong>CRITICAL EMERGENCY</strong>. High priority notification banner will be triggered immediately.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => setStep(2)} isDisabled={submitting}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant={form.urgency === 'CRITICAL' ? 'danger' : 'primary'}
                  icon={Send}
                  isLoading={submitting}
                  className="font-black"
                >
                  {form.urgency === 'CRITICAL' ? 'Dispatch Emergency Request' : 'Submit Blood Request'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
