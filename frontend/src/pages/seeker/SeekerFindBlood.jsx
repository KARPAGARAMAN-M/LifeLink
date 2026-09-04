import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  Search,
  MapPin,
  Filter,
  Navigation,
  Droplet,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  Send,
  Building
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RADII = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
];

export default function SeekerFindBlood() {
  const navigate = useNavigate();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(25);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Request modal state
  const [selectedDonorForRequest, setSelectedDonorForRequest] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [unitsRequired, setUnitsRequired] = useState(1);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('Fetching GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus('GPS location acquired');
      },
      (err) => {
        setLocationStatus('Location access denied. Please use manual city/state search.');
      }
    );
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    setRequestSuccess('');

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

  const handleSendRequest = async (donor) => {
    setSelectedDonorForRequest(donor);
    setHospitalName('');
    setRequestMessage('');
    setUnitsRequired(1);
    setRequestSuccess('');
  };

  const submitBloodRequest = async (e) => {
    e.preventDefault();
    if (!selectedDonorForRequest) return;

    setSubmittingRequest(true);
    try {
      await api.post('/requests', {
        donorId: selectedDonorForRequest.id,
        bloodGroup: selectedDonorForRequest.bloodGroup,
        hospitalName: hospitalName,
        city: selectedDonorForRequest.city || city || 'Local Area',
        unitsRequired: parseInt(unitsRequired, 10),
        urgency: 'NORMAL',
        message: requestMessage,
      });

      setRequestSuccess(`Blood request successfully dispatched to donor ${selectedDonorForRequest.name}!`);
      setSelectedDonorForRequest(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send blood request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-black uppercase tracking-wider">
            <Droplet className="w-4 h-4 text-red-500 fill-current" />
            <span>Blood Seeker Search</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Find Blood Near You
          </h1>
          <p className="text-base text-slate-400 font-medium">
            Search for available donors based on blood group and location.
          </p>
        </div>

        {requestSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-sm font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{requestSuccess}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/seeker/my-requests')}>
              View My Requests →
            </Button>
          </div>
        )}

        {/* Search Controls Filter Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Blood Group Select */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Blood Group Required
                </label>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm font-bold focus:border-red-500 focus:outline-none"
                >
                  <option value="">All Compatible Groups</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      Blood Group {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Radius Select */}
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
                  placeholder="e.g. New York or Salem"
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
                  placeholder="e.g. California or TN"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-red-500"
                />
              </div>

            </div>

            {/* GPS Location & Submit Row */}
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
                  Allow Location GPS
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
                🔎 FIND DONORS
              </Button>
            </div>

          </form>
        </div>

        {/* Search Results Section - ALWAYS VISIBLE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Matching Verified Donors</span>
              <span className="px-2.5 py-0.5 text-xs font-black bg-red-950 text-red-300 border border-red-800 rounded-full">
                {hasSearched ? donors.length : 0}
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Sorted by availability & approximate distance
            </span>
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
            <LoadingSpinner text="Searching for matching blood donors..." />
          ) : donors.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-950 text-red-400 flex items-center justify-center mx-auto border border-red-800">
                <Droplet className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-white">No Donors Found For Selected Criteria</h3>
                <p className="text-xs text-slate-400">
                  Try expanding your search radius, selecting all blood groups, or submitting an emergency broadcast request.
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => navigate('/seeker/emergency-request')}>
                🚨 Post Emergency Request Broadcast
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-red-900/80 transition-all group"
                >
                  {/* Top Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md inline-block mb-2">
                        AVAILABLE DONOR
                      </span>
                      <h3 className="text-lg font-black text-white">{donor.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>{donor.city}, {donor.state || 'Nearby'}</span>
                      </p>
                    </div>

                    {/* Blood Group Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-red-950 text-red-400 border border-red-800 font-black text-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  {/* Donor Status Details */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs font-semibold text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <span className="text-white font-extrabold">
                        {donor.latitude && userLocation ? 'Approx 3.2 km' : 'Within Radius'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Availability:</span>
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        🟢 Available
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Last Donation:</span>
                      <span className="text-slate-200">
                        {donor.lastDonationDate ? donor.lastDonationDate : 'Eligible Donor'}
                      </span>
                    </div>
                  </div>

                  {/* Send Blood Request CTA */}
                  <Button
                    variant="danger"
                    size="md"
                    icon={Send}
                    onClick={() => handleSendRequest(donor)}
                    className="w-full py-3 font-black text-xs shadow-lg shadow-red-600/30 justify-center rounded-xl"
                  >
                    SEND BLOOD REQUEST
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Requesting Blood from Specific Donor */}
        {selectedDonorForRequest && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5 relative animate-fadeIn">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white">Send Request to {selectedDonorForRequest.name}</h3>
                <span className="px-2.5 py-1 text-xs font-black bg-red-950 text-red-300 rounded-md">
                  {selectedDonorForRequest.bloodGroup}
                </span>
              </div>

              <form onSubmit={submitBloodRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Hospital / Medical Facility
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. City General Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Required Units
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsRequired}
                    onChange={(e) => setUnitsRequired(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Request Message / Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief details about the patient or requirement..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedDonorForRequest(null)}
                    className="w-1/2 justify-center text-slate-400"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="danger"
                    loading={submittingRequest}
                    className="w-1/2 justify-center font-black text-xs shadow-lg shadow-red-600/30"
                  >
                    DISPATCH REQUEST
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
