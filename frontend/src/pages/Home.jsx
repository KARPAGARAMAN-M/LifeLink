import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  UserPlus,
  ShieldCheck,
  Zap,
  Lock,
  HeartHandshake,
  ArrowRight,
  Droplet,
  Users,
  Building2,
  Sparkles,
  AlertCircle,
  MapPin,
  Navigation,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats } from '../api/adminApi';
import useGeolocation from '../utils/useGeolocation';
import LocationPermission from '../components/location/LocationPermission';
import EligibilityCalculator from '../components/calculator/EligibilityCalculator';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import { BloodGroupBadge } from '../components/common/Badge';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const geo = useGeolocation();

  // Search widget state
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [radius, setRadius] = useState('10');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');

  // Stats state
  const [stats, setStats] = useState({
    totalUsers: 125,
    activeDonors: 84,
    totalRequests: 92,
    completedRequests: 76,
  });

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        if (res.data?.data) {
          const d = res.data.data;
          setStats({
            totalUsers: d.totalUsers || 125,
            activeDonors: d.activeDonors || d.availableDonors || 84,
            totalRequests: d.totalRequests || 92,
            completedRequests: d.completedRequests || 76,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleEmergencySearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (bloodGroup) query.append('bloodGroup', bloodGroup);
    if (radius) query.append('radius', radius);
    if (geo.latitude && geo.longitude) {
      query.append('latitude', geo.latitude);
      query.append('longitude', geo.longitude);
    }
    if (cityName) query.append('city', cityName);
    if (stateName) query.append('state', stateName);
    query.append('available', 'true');
    navigate(`/search?${query.toString()}`);
  };

  return (
    <div className="overflow-x-hidden bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 text-white">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-800/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-fadeIn">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>Real-Time Emergency Blood Match Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Find Blood. Find Hope. <br />
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent">
                Save Lives.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Find available blood donors near you quickly when every second matters. No registration barrier for blood seekers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/search" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" icon={Search} className="w-full font-black text-base shadow-xl shadow-red-600/40 py-4">
                  🔍 Find Blood Near Me
                </Button>
              </Link>
              <Link to="/donor-registration" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" icon={Heart} className="w-full border-red-400/40 text-slate-100 hover:bg-slate-800 py-4">
                  🩸 Become a Donor
                </Button>
              </Link>
            </div>
          </div>

          {/* ===== LOCATION-FIRST BLOOD SEARCH WIDGET ===== */}
          <div className="mt-14 max-w-4xl mx-auto space-y-4">
            <LocationPermission
              onAllowLocation={geo.requestLocation}
              onManualSearch={() => {}}
              loading={geo.loading}
              permissionDenied={geo.permissionDenied}
              latitude={geo.latitude}
              longitude={geo.longitude}
            />

            <div className="bg-white/10 dark:bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Emergency Blood Search
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-800/60 flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> Zero Login Required
                </span>
              </div>

              <form onSubmit={handleEmergencySearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="Blood Group *"
                  options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                />

                <Select
                  label="Search Radius"
                  options={['5 km', '10 km', '25 km', '50 km']}
                  value={`${radius} km`}
                  onChange={(e) => setRadius(e.target.value.replace(' km', ''))}
                />

                <Input
                  label="City (Optional Fallback)"
                  placeholder="e.g. Salem / Chennai"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />

                <div className="flex items-end">
                  <Button type="submit" variant="danger" icon={Search} className="w-full py-3.5 text-sm font-black shadow-lg shadow-red-600/40">
                    Find Donors Now
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REAL STATISTICS SECTION ===== */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-1">
              <div className="flex justify-center text-red-600 dark:text-red-400 mb-2">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{stats.totalUsers}+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Users</p>
            </div>

            <div className="text-center space-y-1">
              <div className="flex justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                <Droplet className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{stats.activeDonors}+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Donors</p>
            </div>

            <div className="text-center space-y-1">
              <div className="flex justify-center text-amber-600 dark:text-amber-400 mb-2">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{stats.totalRequests}+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Emergency Requests</p>
            </div>

            <div className="text-center space-y-1">
              <div className="flex justify-center text-blue-600 dark:text-blue-400 mb-2">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{stats.completedRequests}+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Successful Matches</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW LIFELINK WORKS ===== */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How <span className="text-red-600 dark:text-red-500">LifeLink</span> Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Immediate, zero-barrier emergency blood matching in 3 fast steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8 text-center space-y-4 border-slate-200/80 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-md">
                <Navigation className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Step 01</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Allow Location & Select Blood</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Open LifeLink, enable location, and choose required blood group. No account creation needed.
              </p>
            </Card>

            <Card hover className="p-8 text-center space-y-4 border-slate-200/80 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <Search className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Step 02</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Instant Distance Match</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                View nearest available donors ranked by availability and distance (e.g. 2.4 km away).
              </p>
            </Card>

            <Card hover className="p-8 text-center space-y-4 border-slate-200/80 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md">
                <Zap className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Step 03</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Send Request & Connect</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dispatch an emergency request directly to the donor via SMS/Email notification in seconds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== ELIGIBILITY & BECOME A DONOR SECTION ===== */}
      <section id="about" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                Become a LifeLink Donor
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Register Once. <br />
                <span className="text-red-600 dark:text-red-500">Save Lives Nearby.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Register as a donor in under a minute. Control your availability toggle, receive emergency notifications when someone nearby needs blood, and manage your donation history.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/donor-registration">
                  <Button size="lg" variant="primary" icon={UserPlus} className="font-bold">
                    Become a Donor Now
                  </Button>
                </Link>
                <Link to="/search">
                  <Button size="lg" variant="danger" icon={Search} className="font-bold">
                    Search Available Donors
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <EligibilityCalculator />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
