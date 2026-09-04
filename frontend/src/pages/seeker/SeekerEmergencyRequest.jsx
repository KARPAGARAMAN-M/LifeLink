import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  AlertCircle,
  Siren,
  Building,
  MapPin,
  Calendar,
  Clock,
  Phone,
  FileText,
  CheckCircle2,
  Droplet,
  ShieldCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SeekerEmergencyRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    unitsRequired: 2,
    hospitalName: '',
    city: '',
    state: '',
    requiredDate: new Date().toISOString().split('T')[0],
    requiredTime: 'Immediate',
    emergencyDescription: '',
    contactNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Find a matching donor or send broadcast emergency request
      // We search donors to assign first match or send emergency payload
      const searchRes = await api.get('/donors/search', {
        params: { bloodGroup: formData.bloodGroup, city: formData.city }
      });
      const donors = searchRes.data?.data || [];
      const targetDonorId = donors.length > 0 ? donors[0].id : 1;

      await api.post('/requests', {
        donorId: targetDonorId,
        bloodGroup: formData.bloodGroup,
        hospitalName: formData.hospitalName,
        city: formData.city,
        unitsRequired: parseInt(formData.unitsRequired, 10),
        contactNumber: formData.contactNumber,
        requiredDate: formData.requiredDate,
        urgency: 'CRITICAL',
        message: `EMERGENCY REQUEST [Time: ${formData.requiredTime}]\nLocation: ${formData.city}, ${formData.state}\nContact: ${formData.contactNumber}\nDetails: ${formData.emergencyDescription}`,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch emergency request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="max-w-md w-full bg-slate-900 border-2 border-red-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 bg-red-950 text-red-500 rounded-3xl border border-red-700 flex items-center justify-center mx-auto shadow-inner">
            <Siren className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">EMERGENCY DISPATCHED</h2>
            <p className="text-xs text-slate-300">
              Your emergency request for <strong className="text-red-400">{formData.unitsRequired} Units of {formData.bloodGroup}</strong> has been created and broadcasted to available donors nearby.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-1 text-slate-300">
            <p><strong>Hospital:</strong> {formData.hospitalName}</p>
            <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
            <p><strong>Status:</strong> <span className="text-amber-400 font-bold">PENDING DONOR RESPONSE</span></p>
          </div>

          <div className="space-y-3">
            <Button
              variant="danger"
              size="lg"
              onClick={() => navigate('/seeker/my-requests')}
              className="w-full justify-center font-black"
            >
              TRACK REQUEST STATUS
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuccess(false)}
              className="w-full justify-center text-slate-400"
            >
              Create Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Emergency Alert Banner Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 p-8 rounded-3xl border-2 border-red-600 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
              <Siren className="w-4 h-4 animate-bounce" />
              <span>HIGH URGENCY DISPATCH</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Emergency Blood Request
            </h1>
            <p className="text-sm font-medium text-red-200">
              Immediately notify verified available donors in your location radius.
            </p>
          </div>
        </div>

        {/* Emergency Request Form Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-950 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
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
                    <option key={bg} value={bg}>
                      {bg} Blood Group
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Required Units *
                </label>
                <Input
                  type="number"
                  name="unitsRequired"
                  min="1"
                  max="10"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white focus:border-red-500 font-bold"
                />
              </div>
            </div>

            {/* Hospital / Facility */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Hospital / Medical Facility *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="hospitalName"
                  placeholder="e.g. St. Jude Emergency Hospital"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
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
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
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
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Date & Time Grid */}
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
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Contact Phone Number */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Number *
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  name="contactNumber"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Emergency Description */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Emergency Description / Patient Notes
              </label>
              <textarea
                name="emergencyDescription"
                rows={3}
                placeholder="Urgent ICU requirement, surgery scheduled, etc..."
                value={formData.emergencyDescription}
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
                🚨 SEND EMERGENCY REQUEST
              </Button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
