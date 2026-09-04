import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { User, Mail, Phone, Lock, MapPin, Building, Calendar, Heart, AlertCircle, CheckSquare, Square } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: 'O+',
    dob: '',
    city: '',
    state: '',
    lastDonationDate: '',
    agreedToTerms: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { selectRole, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreedToTerms) {
      setError('You must agree to the donor eligibility terms to register as a donor.');
      return;
    }

    setLoading(true);

    try {
      // Register donor via public endpoint or auth register
      await api.post('/donors/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        bloodGroup: formData.bloodGroup,
        dob: formData.dob ? formData.dob : null,
        city: formData.city,
        state: formData.state,
        lastDonationDate: formData.lastDonationDate ? formData.lastDonationDate : null,
        availability: true,
      });

      // Auto login as donor
      await login(formData.email, formData.password, 'DONOR');
      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-black uppercase tracking-wider">
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
            <span>Blood Donor Registration</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Become a LifeLink Blood Donor
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Join our network of heroic donors and help save lives when every second counts.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Blood Group & DOB Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm font-black focus:border-rose-500 focus:outline-none"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      Blood Group {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-rose-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* City & State Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  City *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
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
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Last Donation Date */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Last Donation Date (Optional)
              </label>
              <div className="relative">
                <Input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="bg-slate-950 border-slate-700 text-white pl-10 focus:border-rose-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Donor Terms Agreement Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I agree to the LifeLink blood donor terms, confirm I am eligible to donate blood, and consent to receiving blood request alerts in my area.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={Heart}
                className="w-full py-4 font-black text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-600/30 justify-center rounded-2xl"
              >
                REGISTER AS BLOOD DONOR
              </Button>
            </div>
          </form>

          {/* Already registered */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Already registered as a donor?{' '}
              <Link
                to="/donor/login"
                className="font-extrabold text-rose-400 hover:text-rose-300 underline ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
