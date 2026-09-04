import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import {
  Search,
  MapPin,
  Navigation,
  Droplet,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  Send,
  Building,
  Calendar,
  Clock,
  SearchCode,
  Heart,
  X
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RADII = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
];

export default function FindBlood() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [selectedRadius, setSelectedRadius] = useState(25);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Request Modal State
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [requestForm, setRequestForm] = useState({
    requesterName: '',
    requesterPhone: '',
    requesterEmail: '',
    bloodGroup: 'O+',
    unitsRequired: 1,
    hospitalName: '',
    city: '',
    state: '',
    requiredDate: new Date().toISOString().split('T')[0],
    requiredTime: 'Immediate',
    urgency: 'NORMAL',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Fetching GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('GPS location acquired');
      },
      () => {
        setLocationStatus('Location access denied. Use city/state search.');
      }
    );
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    setCreatedRequest(null);

    try {
      const params = {};
      if (selectedBloodGroup) params.bloodGroup = selectedBloodGroup;
      if (city) params.city = city;
      if (state) params.state = state;
      if (selectedRadius) params.radius = selectedRadius;
      if (userLocation) {
        params.latitude = userLocation.latitude;
        params.longitude = userLocation.longitude;
      }

      const res = await api.get('/donors/search', { params });
      setDonors(res.data?.data || []);
    } catch (err) {
      console.error('Failed to search donors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRequestModal = (donor) => {
    setSelectedDonor(donor);
    setRequestForm({
      ...requestForm,
      bloodGroup: donor ? donor.bloodGroup : (selectedBloodGroup || 'O+'),
      city: donor?.city || city || '',
      state: donor?.state || state || '',
    });
  };

  const handleFormChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const handleSubmitBloodRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        donorId: selectedDonor ? selectedDonor.id : null,
        bloodGroup: requestForm.bloodGroup,
        hospitalName: requestForm.hospitalName,
        city: requestForm.city,
        state: requestForm.state,
        unitsRequired: parseInt(requestForm.unitsRequired, 10),
        contactNumber: requestForm.requesterPhone,
        requiredDate: requestForm.requiredDate,
        requiredTime: requestForm.requiredTime,
        urgency: requestForm.urgency,
        requesterName: requestForm.requesterName,
        requesterPhone: requestForm.requesterPhone,
        requesterEmail: requestForm.requesterEmail,
        message: requestForm.message,
      };

      const res = await api.post('/requests/public', payload);
      const data = res.data?.data;
      setCreatedRequest(data);
      setSelectedDonor(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-black uppercase tracking-wider">
            <Droplet className="w-4 h-4 text-red-500 fill-current" />
            <span>Public Blood Search</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Find Blood Near You
          </h1>
          <p className="text-base text-slate-400 font-medium">
            Find available blood donors based on blood group and location. No login required.
          </p>
        </div>

        {/* Request Submission Confirmation Card */}
        {createdRequest && (
          <div className="p-8 rounded-3xl bg-slate-900 border-2 border-emerald-800 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Blood Request Submitted Successfully!</h3>
                  <p className="text-xs text-slate-400">Suitable donors have been notified of your request.</p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400">REQUEST ID</p>
                <p className="text-lg font-black text-amber-400">{createdRequest.requestCode || `LL-REQ-${createdRequest.id}`}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-300">
              <p>Hospital: <strong className="text-white">{createdRequest.hospitalName}</strong></p>
              <p>Blood Group: <strong className="text-red-400">{createdRequest.bloodGroup}</strong></p>
              <p>Status: <span className="text-amber-400 font-bold uppercase">{createdRequest.status || 'PENDING'}</span></p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="danger"
                size="md"
                icon={SearchCode}
                onClick={() => navigate(`/track-request?code=${createdRequest.requestCode || createdRequest.id}&phone=${createdRequest.requesterPhone}`)}
                className="font-black"
              >
                [ TRACK REQUEST ]
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCreatedRequest(null)} className="text-slate-400">
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Search Controls Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Blood Group Select */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Blood Group
                </label>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm font-bold focus:border-red-500 focus:outline-none"
                >
                  <option value="">All Blood Groups</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg} Blood Group
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Radius */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Search Radius
                </label>
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm font-bold focus:border-red-500 focus:outline-none"
                >
                  {RADII.map((r) => (
                    <option key={r.value} value={r.value}>
                      Within {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Input */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Salem or New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-red-500"
                />
              </div>

              {/* State Input */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  State / Region
                </label>
                <Input
                  type="text"
                  placeholder="e.g. TN or California"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-red-500"
                />
              </div>

            </div>

            {/* GPS Location & Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Navigation}
                  onClick={handleAllowLocation}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                >
                  📍 Allow Location
                </Button>
                {locationStatus && (
                  <span className="text-xs text-slate-400 font-semibold">{locationStatus}</span>
                )}
              </div>

              <Button
                type="submit"
                variant="danger"
                size="lg"
                loading={loading}
                icon={Search}
                className="w-full sm:w-auto px-8 py-3.5 font-black text-sm shadow-xl shadow-red-600/30 justify-center rounded-2xl"
              >
                [ 🔎 FIND DONORS ]
              </Button>
            </div>

          </form>
        </div>

        {/* Matching Available Donors Section - ALWAYS VISIBLE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Matching Available Donors</span>
              <span className="px-2.5 py-0.5 text-xs font-black bg-red-950 text-red-300 border border-red-800 rounded-full">
                {hasSearched ? donors.length : 0}
              </span>
            </h2>
          </div>

          {!hasSearched ? (
            /* BLURRED / DISABLED PLACEHOLDER BEFORE SEARCH */
            <div className="relative p-8 sm:p-12 text-center bg-slate-900/80 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden min-h-[320px] flex items-center justify-center">
              
              {/* Overlay Prompt */}
              <div className="relative z-20 flex flex-col items-center justify-center max-w-md mx-auto space-y-4 p-6 bg-slate-950/90 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-red-950 text-red-400 border border-red-800/80 flex items-center justify-center shadow-lg">
                  <Search className="w-7 h-7 text-red-500 animate-pulse" />
                </div>
                <div className="space-y-1.5 text-center">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                    Search For Blood To View Matching Donors
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Select your blood group, radius, city, or state above and click <strong className="text-red-400">FIND DONORS</strong> to reveal available matching blood donors.
                  </p>
                </div>
              </div>

              {/* Blurred / Disabled Background Placeholder Cards */}
              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 filter blur-md opacity-20 pointer-events-none select-none aria-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-800/60 rounded-3xl border border-slate-700/50 p-6 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <div className="w-24 h-4 bg-slate-700/80 rounded"></div>
                      <div className="w-10 h-10 bg-slate-700/80 rounded-xl"></div>
                    </div>
                    <div className="w-32 h-3 bg-slate-700/80 rounded"></div>
                    <div className="h-16 bg-slate-800/80 rounded-xl"></div>
                    <div className="h-10 bg-slate-700/80 rounded-xl"></div>
                  </div>
                ))}
              </div>

            </div>
          ) : loading ? (
            <LoadingSpinner text="Searching available donors..." />
          ) : donors.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-950 text-red-400 flex items-center justify-center mx-auto border border-red-800">
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Donors Found For Current Filters</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Expand your search radius or click below to submit an emergency broadcast request to all active donors.
              </p>
              <Button variant="danger" size="sm" onClick={() => navigate('/emergency-request')}>
                🚨 Send Emergency Blood Request
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-red-900/80 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800 rounded-md inline-block mb-2">
                        ❤️ AVAILABLE BLOOD DONOR
                      </span>
                      <h3 className="text-lg font-black text-white">{donor.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Location: <strong>{donor.city || 'Salem'}, {donor.state || 'Local'}</strong></span>
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-red-950 text-red-400 border border-red-800 font-black text-xl flex items-center justify-center shadow-lg">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 font-semibold text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <span className="text-white font-extrabold">Approx 3.2 km</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Availability:</span>
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        🟢 Available
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Eligibility:</span>
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        ✅ Eligible
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="md"
                    icon={Send}
                    onClick={() => handleOpenRequestModal(donor)}
                    className="w-full py-3 font-black text-xs shadow-lg shadow-red-600/30 justify-center rounded-xl"
                  >
                    [ REQUEST BLOOD ]
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT BLOOD REQUEST MODAL (ASK DETAILS ONLY NOW!) */}
        {selectedDonor && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative my-8 animate-fadeIn">
              
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-white">Submit Blood Request</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Provide the required details so donor <strong className="text-white">{selectedDonor.name}</strong> can respond.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitBloodRequest} className="space-y-4">
                
                {/* Seeker Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="requesterName"
                      placeholder="e.g. John Doe"
                      value={requestForm.requesterName}
                      onChange={handleFormChange}
                      required
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      name="requesterPhone"
                      placeholder="+1 (555) 000-0000"
                      value={requestForm.requesterPhone}
                      onChange={handleFormChange}
                      required
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    name="requesterEmail"
                    placeholder="john@example.com"
                    value={requestForm.requesterEmail}
                    onChange={handleFormChange}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                {/* Blood & Facility Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      Blood Group Required *
                    </label>
                    <select
                      name="bloodGroup"
                      value={requestForm.bloodGroup}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-black"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      Number of Units *
                    </label>
                    <Input
                      type="number"
                      name="unitsRequired"
                      min="1"
                      max="10"
                      value={requestForm.unitsRequired}
                      onChange={handleFormChange}
                      required
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                    Hospital / Medical Facility *
                  </label>
                  <Input
                    type="text"
                    name="hospitalName"
                    placeholder="e.g. Salem City Hospital"
                    value={requestForm.hospitalName}
                    onChange={handleFormChange}
                    required
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      City *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Salem"
                      value={requestForm.city}
                      onChange={handleFormChange}
                      required
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      State / Region *
                    </label>
                    <Input
                      type="text"
                      name="state"
                      placeholder="TN"
                      value={requestForm.state}
                      onChange={handleFormChange}
                      required
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      Required Date *
                    </label>
                    <Input
                      type="date"
                      name="requiredDate"
                      value={requestForm.requiredDate}
                      onChange={handleFormChange}
                      required
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                      Request Type *
                    </label>
                    <select
                      name="urgency"
                      value={requestForm.urgency}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-bold"
                    >
                      <option value="NORMAL">Normal Request</option>
                      <option value="CRITICAL">🚨 Emergency Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                    Additional Message / Notes
                  </label>
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Brief description of patient condition..."
                    value={requestForm.message}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedDonor(null)}
                    className="w-1/2 justify-center text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    loading={submitting}
                    className="w-1/2 justify-center font-black text-xs shadow-lg shadow-red-600/30"
                  >
                    SUBMIT REQUEST
                  </Button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
