import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaHospital, FaTint, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function RequestBlood() {
  const { donorId } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    donorId: donorId || '',
    bloodGroup: '', hospitalName: '', city: '',
    urgency: 'NORMAL', message: '',
  });

  useEffect(() => {
    if (donorId) {
      setLoading(true);
      api.get(`/donors/${donorId}`)
        .then(res => {
          const d = res.data.data;
          setDonor(d);
          setForm(prev => ({
            ...prev,
            donorId: d.id,
            bloodGroup: d.bloodGroup,
            city: d.city,
          }));
        })
        .catch(() => toast.error('Donor not found'))
        .finally(() => setLoading(false));
    }
  }, [donorId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.donorId) { toast.error('Please specify a donor ID'); return; }
    setSubmitting(true);
    try {
      await api.post('/requests', form);
      toast.success('Blood request sent successfully! 🩸');
      navigate('/request-history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading donor details..." />;

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 -z-10" />

      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">
            Request <span className="gradient-text">Blood</span>
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Fill in the details to send a blood request</p>
        </div>

        {/* Donor info card */}
        {donor && (
          <div className="glass-card p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{donor.name?.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-surface-900 dark:text-white">{donor.name}</p>
              <p className="text-sm text-surface-500">{donor.city}, {donor.state} • {donor.bloodGroup}</p>
            </div>
            <span className="badge-accepted">Available</span>
          </div>
        )}

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!donorId && (
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Donor ID *</label>
                <input name="donorId" type="number" value={form.donorId} onChange={handleChange}
                  className="input-field" placeholder="Enter donor ID" required />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaTint className="inline mr-2 text-primary-500" />Blood Group Needed *
              </label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="select-field" required>
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaHospital className="inline mr-2 text-primary-500" />Hospital Name *
              </label>
              <input name="hospitalName" value={form.hospitalName} onChange={handleChange}
                className="input-field" placeholder="Enter hospital name" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-primary-500" />City *
              </label>
              <input name="city" value={form.city} onChange={handleChange}
                className="input-field" placeholder="Enter city" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <FaExclamationTriangle className="inline mr-2 text-primary-500" />Urgency Level *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {URGENCY_LEVELS.map(level => (
                  <button key={level} type="button"
                    onClick={() => setForm({ ...form, urgency: level })}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                      form.urgency === level
                        ? level === 'CRITICAL' ? 'bg-red-600 text-white shadow-lg'
                          : level === 'URGENT' ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-surface-600 text-white shadow-lg'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                    }`}>
                    {level === 'CRITICAL' ? '🔴' : level === 'URGENT' ? '🟠' : '🟢'} {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Message (Optional)</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                className="input-field !h-24 resize-none" placeholder="Add a message to the donor..." />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🩸 Send Blood Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
