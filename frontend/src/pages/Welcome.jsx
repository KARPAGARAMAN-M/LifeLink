import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  Droplet,
  MapPin,
  Clock,
  UserCheck,
  SearchCode,
  Activity,
  HeartPulse,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/common/Button';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative selection:bg-red-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ===== HEADER ===== */}
      <header className="relative z-10 w-full pt-8 pb-4 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-red-600/30">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Life<span className="text-red-500">Link</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-300 rounded-md border border-red-900/50">
                Official Platform
              </span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Smart Blood Donation Platform
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-slate-300">
          <Link to="/track-request" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:border-slate-700">
            <SearchCode className="w-4 h-4" />
            <span>Track Request Status</span>
          </Link>
          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Donor Network</span>
          </div>
        </div>
      </header>

      {/* ===== MAIN HERO / ROLE SELECTION ===== */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col justify-center items-center">
        
        {/* Branding & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-black uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>Smart Blood Donation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Life<span className="text-red-500">Link</span>
          </h1>

          <p className="text-lg sm:text-2xl font-black bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent italic">
            "Every donation can save a life."
          </p>

          <p className="text-base sm:text-xl font-black text-white tracking-tight pt-4">
            What brings you to LifeLink?
          </p>
        </div>

        {/* ===== TWO CLEAR ROLE OPTIONS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* OPTION 1: BLOOD SEEKER (NO LOGIN) */}
          <div className="group relative rounded-3xl bg-slate-900/90 p-8 border-2 border-red-900/60 hover:border-red-500 transition-all duration-300 shadow-2xl hover:shadow-red-500/20 flex flex-col justify-between space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/25 transition-all pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-red-950 text-red-400 border border-red-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Droplet className="w-8 h-8 fill-current text-red-500" />
                </div>
                <span className="px-3 py-1.5 rounded-full bg-red-950/80 text-red-300 text-xs font-black uppercase tracking-wider border border-red-800">
                  Zero Login Needed
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🩸</span>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    I NEED BLOOD
                  </h2>
                </div>
                <p className="text-sm font-bold text-red-400 mt-1 uppercase tracking-wider">
                  Blood Seeker
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed font-medium">
                  "Find available blood donors near you."
                </p>
              </div>

              {/* Seeker Key Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Immediate blood search (No registration required)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>Filter donors by blood group, location & radius</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <SearchCode className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Submit request & track live status with Request ID</span>
                </div>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <Button
                variant="danger"
                size="lg"
                icon={Search}
                onClick={() => navigate('/find-blood')}
                className="w-full py-4 text-base font-black shadow-xl shadow-red-600/40 justify-center rounded-2xl group-hover:scale-[1.02] transition-all"
              >
                🩸 I NEED BLOOD
              </Button>
            </div>
          </div>

          {/* OPTION 2: BLOOD DONOR (ACCOUNT REQUIRED) */}
          <div className="group relative rounded-3xl bg-slate-900/90 p-8 border-2 border-rose-900/60 hover:border-rose-500 transition-all duration-300 shadow-2xl hover:shadow-rose-500/20 flex flex-col justify-between space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600/10 rounded-full blur-3xl group-hover:bg-rose-600/25 transition-all pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 fill-current text-rose-500 animate-pulse" />
                </div>
                <span className="px-3 py-1.5 rounded-full bg-rose-950/80 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-800">
                  Donor Portal
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❤️</span>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    I WANT TO DONATE
                  </h2>
                </div>
                <p className="text-sm font-bold text-rose-400 mt-1 uppercase tracking-wider">
                  Blood Donor
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed font-medium">
                  "Become a donor and help save lives."
                </p>
              </div>

              {/* Donor Key Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Manage donor availability status (🟢 Available)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HeartPulse className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Receive and respond to incoming blood requests</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Track your personal donation history & eligibility</span>
                </div>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <Button
                variant="primary"
                size="lg"
                icon={Heart}
                onClick={() => navigate('/donor/login')}
                className="w-full py-4 text-base font-black bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-600/40 justify-center rounded-2xl group-hover:scale-[1.02] transition-all"
              >
                ❤️ I WANT TO DONATE
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LifeLink Smart Blood Donation Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 font-semibold">
            <Link to="/track-request" className="text-amber-400 hover:underline">
              Track Request Status
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
