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
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPublicStats } from '../api/userApi';
import useGeolocation from '../utils/useGeolocation';
import LocationPermission from '../components/location/LocationPermission';
import EligibilityCalculator from '../components/calculator/EligibilityCalculator';
import BloodCompatibility from '../components/calculator/BloodCompatibility';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import AppFlowchart from '../components/common/AppFlowchart';
import WhyDonate from '../components/educational/WhyDonate';
import WhoCanDonate from '../components/educational/WhoCanDonate';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const geo = useGeolocation();

  // Search widget state
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [radius, setRadius] = useState('10');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');

  // Stats state - initialized to real database counts
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDonors: 0,
    totalRequests: 0,
    completedRequests: 0,
  });

  useEffect(() => {
    getPublicStats()
      .then((res) => {
        if (res.data?.data) {
          const d = res.data.data;
          setStats({
            totalUsers: d.totalUsers || 0,
            activeDonors: d.activeDonors || 0,
            totalRequests: d.totalRequests || 0,
            completedRequests: d.completedRequests || 0,
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
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 text-white">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-800/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>Smart Blood Donation Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Every donation <br />
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent">
                can save a life.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Connect with verified blood donors and help make critical blood available when it matters most.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/search" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" icon={Search} className="w-full font-black text-base shadow-xl shadow-red-600/40 py-4 px-8 justify-center">
                  Find Blood
                </Button>
              </Link>
              <Link to="/donor-registration" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" icon={Heart} className="w-full border-red-400/40 text-slate-100 hover:bg-slate-800/80 py-4 px-8 justify-center">
                  Become a Donor
                </Button>
              </Link>
            </div>
          </div>

          {/* ===== TRUST FEATURES STRIP ===== */}
          <div className="mt-14 pt-8 border-t border-white/10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-black text-white">Secure Donor Accounts</p>
                <p className="text-[11px] text-slate-400">Encrypted user & location data</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Users className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-black text-white">Verified Donor Network</p>
                <p className="text-[11px] text-slate-400">Screened active volunteers</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Navigation className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-black text-white">Real-Time Proximity Matching</p>
                <p className="text-[11px] text-slate-400">Instant distance calculation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMERGENCY BLOOD SEARCH SECTION ===== */}
      <section className="py-14 bg-slate-100 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Emergency Blood Search
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Start Searching for Blood Near You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select your required blood group and location to find available donors instantly. Zero login required for emergency search.
            </p>
          </div>

          <LocationPermission
            onAllowLocation={geo.requestLocation}
            onManualSearch={() => {}}
            loading={geo.loading}
            permissionDenied={geo.permissionDenied}
            latitude={geo.latitude}
            longitude={geo.longitude}
          />

          <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <form id="search-form" onSubmit={handleEmergencySearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                label="City / Location"
                placeholder="e.g. Salem / Chennai"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />

              <div className="flex items-end">
                <Button type="submit" variant="danger" icon={Search} className="w-full py-3.5 text-sm font-black shadow-lg shadow-red-600/40 justify-center">
                  Find Blood Near Me
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How <span className="text-red-600 dark:text-red-500">LifeLink</span> Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Connecting blood seekers with nearby verified donors quickly in critical situations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card hover className="p-8 text-center space-y-4 border-slate-200/80 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-md">
                <Search className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Step 01</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Search for Blood</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Select the required blood group and search nearby locations without mandatory account sign-up.
              </p>
            </Card>

            {/* Step 2 */}
            <Card hover className="p-8 text-center space-y-4 border-slate-200/80 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Step 02</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Find a Verified Donor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                View matching donors ranked by real-time proximity, blood group compatibility, and current availability status.
              </p>
            </Card>

            {/* Step 3 */}
            <Card hover className="p-8 text-center space-y-4 border-slate-200/80 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md">
                <Zap className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Step 03</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Connect and Save a Life</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Send emergency blood request alerts directly to available donors and receive immediate assistance.
              </p>
            </Card>
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

      {/* ===== BLOOD COMPATIBILITY MODULE ===== */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BloodCompatibility />
        </div>
      </section>

      {/* ===== WHY DONATE BLOOD & WHO CAN DONATE ===== */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <WhyDonate />
          <WhoCanDonate />
        </div>
      </section>

      {/* ===== BECOME A DONOR SECTION ===== */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                Become a LifeLink Donor
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Join the Network. <br />
                <span className="text-red-600 dark:text-red-500">Become a Donor Today.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Register as a blood donor to receive emergency match requests from patients in need nearby. Control your availability anytime from your donor command dashboard.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/donor-registration">
                  <Button size="lg" variant="primary" icon={UserPlus} className="font-bold py-3.5 px-8">
                    Become a Donor
                  </Button>
                </Link>
                <Link to="/search">
                  <Button size="lg" variant="danger" icon={Search} className="font-bold py-3.5 px-8">
                    Find Blood
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


