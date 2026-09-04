import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Siren,
  Building,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  SearchCode
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EmergencyRequestPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    requesterName: '',
    requesterPhone: '',
    requesterEmail: '',
    bloodGroup: 'O+',
    unitsRequired: 2,
    hospitalName: '',
    city: '',
    state: '',
    requiredDate: new Date().toISOString().split('T')[0],
    requiredTime: 'Immediate',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/requests/emergency', {
        ...formData,
        urgency: 'CRITICAL',
        unitsRequired: parseInt(formData.unitsRequired, 10),
        contactNumber: formData.requesterPhone,
      });

      setCreatedRequest(res.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch emergency request. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  if (createdRequest) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="max-w-md w-full bg-slate-900 border-2 border-red-700 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 bg-red-950 text-red-500 rounded-3xl border border-red-700 flex items-center justify-center mx-auto shadow-inner">
            <Siren className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">EMERGENCY BROADCAST SENT</h2>
            <p className="text-xs text-slate-300">
              Your emergency request for <strong className="text-red-400">{createdRequest.unitsRequired} Units of {createdRequest.bloodGroup}</strong> has been created.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">REQUEST ID:</span>
              <span className="text-base font-black text-amber-400">{createdRequest.requestCode || `LL-REQ-${createdRequest.id}`}</span>
            </div>
            <p><strong>Hospital:</strong> {createdRequest.hospitalName}</p>
            <p><strong>Location:</strong> {createdRequest.city}</p>
            <p><strong>Status:</strong> <span className="text-amber-400 font-bold uppercase">{createdRequest.status || 'PENDING'}</span></p>
          </div>

          <div className="space-y-3">
            <Button
              variant="danger"
              size="lg"
              icon={SearchCode}
              onClick={() => navigate(`/track-request?code=${createdRequest.requestCode || createdRequest.id}&phone=${createdRequest.requesterPhone}`)}
              className="w-full justify-center font-black"
            >
              [ TRACK REQUEST STATUS ]
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreatedRequest(null)}
              className="w-full justify-center text-slate-400"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 p-8 rounded-3xl border-2 border-red-600 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
              <Siren className="w-4 h-4 animate-bounce" />
              <span>HIGH URGENCY EMERGENCY DISPATCH</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Emergency Blood Request
            </h1>
            <p className="text-sm font-medium text-red-200">
              Directly broadcast urgent blood requirements to all verified available donors. No login required.
            </p>
          </div>
        </div>

        {/* Emergency Form Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-950 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Requester Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="requesterName"
                    placeholder="e.g. John Doe"
                    value={formData.requesterName}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    name="requesterPhone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.requesterPhone}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Required Blood Group & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Blood Group Required *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm font-black focus:border-red-500 focus:outline-none"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg} Blood Group</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Units Required *
                </label>
                <Input
                  type="number"
                  name="unitsRequired"
                  min="1"
                  max="10"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white font-bold focus:border-red-500"
                />
              </div>
            </div>

            {/* Hospital Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Hospital / Medical Facility *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="hospitalName"
                  placeholder="e.g. City General Hospital"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Location City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  City *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="city"
                    placeholder="e.g. Salem"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  State / Region *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="state"
                    placeholder="e.g. Tamil Nadu"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Required Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Required Date *
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Required Time *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="requiredTime"
                    placeholder="e.g. Immediate / Today 6:00 PM"
                    value={formData.requiredTime}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-red-500"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Emergency Description */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Emergency Description / ICU Notes
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Urgent ICU surgery requirement..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="danger"
                size="lg"
                loading={loading}
                icon={Siren}
                className="w-full py-4 font-black text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-2xl shadow-red-600/40 justify-center rounded-2xl"
              >
                [ 🚨 SEND EMERGENCY REQUEST ]
              </Button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
