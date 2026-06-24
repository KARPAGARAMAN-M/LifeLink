import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS, INDIAN_STATES } from '../utils/constants';
import { checkEligibility, getEligibilityColor } from '../utils/eligibilityCalculator';
import { FaTint, FaMapMarkerAlt, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DonorRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: '', city: '', state: '', phone: '',
    availability: true, lastDonationDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const eligibility = form.lastDonationDate ? checkEligibility(form.lastDonationDate) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/donors', {
        ...form,
        lastDonationDate: form.lastDonationDate || null,
      });
      toast.success('Donor registration successful! Thank you for being a hero! 🩸');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 -z-10" />

      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaTint className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">Become a Donor</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Register as a blood donor and help save lives, {user?.name}</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaTint className="inline mr-2 text-primary-500" />Blood Group *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => (
                  <button key={bg} type="button"
                    onClick={() => setForm({ ...form, bloodGroup: bg })}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                      form.bloodGroup === bg
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}>
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* City & State */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-primary-500" />City *
                </label>
                <input name="city" value={form.city} onChange={handleChange}
                  className="input-field" placeholder="Enter your city" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">State *</label>
                <select name="state" value={form.state} onChange={handleChange} className="select-field" required>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaPhone className="inline mr-2 text-primary-500" />Phone Number *
              </label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="input-field" placeholder="10-digit phone number" pattern="[0-9]{10}" required />
            </div>

            {/* Last Donation Date */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaCalendarAlt className="inline mr-2 text-primary-500" />Last Donation Date
              </label>
              <input type="date" name="lastDonationDate" value={form.lastDonationDate} onChange={handleChange}
                className="input-field" max={new Date().toISOString().split('T')[0]} />
              {eligibility && (
                <p className={`mt-2 text-sm font-medium ${getEligibilityColor(eligibility.eligible)}`}>
                  {eligibility.message}
                  {eligibility.nextEligibleDate && ` (Next eligible: ${eligibility.nextEligibleDate})`}
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 dark:bg-surface-700 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                {form.availability ? '✅ Available for donation' : '❌ Not available right now'}
              </span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🩸 Register as Donor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
