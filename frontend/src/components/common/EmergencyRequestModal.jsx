import React, { useState } from 'react';
import { X, Send, AlertTriangle, Building2, MapPin, Phone, User, Droplet, ShieldAlert } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../utils/constants';
import { createEmergencyBloodRequest } from '../../api/requestApi';
import toast from 'react-hot-toast';

export default function EmergencyRequestModal({ donor, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    donorId: donor ? donor.id : '',
    bloodGroup: donor ? donor.bloodGroup : 'O+',
    hospitalName: '',
    city: donor ? donor.city : '',
    urgency: 'CRITICAL',
    requesterName: '',
    requesterPhone: '',
    requesterEmail: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.requesterName || !form.requesterPhone) {
      toast.error('Please enter your Name and Phone Number so the donor can contact you.');
      return;
    }
    if (!form.hospitalName || !form.city) {
      toast.error('Hospital Name and City are required.');
      return;
    }

    setSubmitting(true);
    try {
      await createEmergencyBloodRequest({
        donorId: form.donorId,
        bloodGroup: form.bloodGroup,
        hospitalName: form.hospitalName,
        city: form.city,
        urgency: form.urgency,
        requesterName: form.requesterName,
        requesterPhone: form.requesterPhone,
        requesterEmail: form.requesterEmail,
        message: form.message,
      });

      toast.success('Emergency request dispatched to donor! 🩸');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit emergency request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-lg shadow-red-600/30">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Emergency Blood Request</h3>
              <p className="text-xs text-slate-500">Zero Login Required • Direct Donor Notification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Donor Card Banner */}
        {donor && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-xs">
                {donor.bloodGroup}
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">Requesting: {donor.name}</p>
                <p className="text-[11px] text-slate-500">{donor.city}, {donor.state}</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
              Available
            </span>
          </div>
        )}

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name *"
              icon={User}
              name="requesterName"
              placeholder="e.g. Ramesh Kumar"
              value={form.requesterName}
              onChange={handleChange}
              required
            />

            <Input
              label="Your Contact Phone *"
              icon={Phone}
              name="requesterPhone"
              placeholder="e.g. +91 9876543210"
              value={form.requesterPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Blood Group Needed *"
              icon={Droplet}
              name="bloodGroup"
              options={BLOOD_GROUPS}
              value={form.bloodGroup}
              onChange={handleChange}
              required
            />

            <Select
              label="Urgency Level *"
              name="urgency"
              options={URGENCY_LEVELS}
              value={form.urgency}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hospital Name *"
              icon={Building2}
              name="hospitalName"
              placeholder="e.g. City General Hospital"
              value={form.hospitalName}
              onChange={handleChange}
              required
            />

            <Input
              label="Hospital City / Town *"
              icon={MapPin}
              name="city"
              placeholder="e.g. Salem / Chennai"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Message / Patient Details (Optional)
            </label>
            <textarea
              name="message"
              rows={2}
              placeholder="Provide doctor name, room number, or patient requirement..."
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="danger"
              icon={Send}
              isLoading={submitting}
              className="w-full py-3 text-sm font-black shadow-lg shadow-red-600/40"
            >
              Send Emergency Request Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
