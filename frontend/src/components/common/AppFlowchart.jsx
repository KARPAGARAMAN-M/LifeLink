import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  UserPlus,
  Navigation,
  LayoutDashboard,
  ToggleRight,
  Bell,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Lock,
  UserCheck,
  Zap,
} from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function AppFlowchart({ onSelectBloodGroup, onTriggerLocation }) {
  const navigate = useNavigate();

  return (
    <div className="w-full my-12 space-y-6">
      {/* Title & Badge */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          Interactive System Architecture
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How LifeLink <span className="text-red-600 dark:text-red-500">Connects Lives</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Click any step in the flowchart below to interact directly with that workflow.
        </p>
      </div>

      {/* Main Flowchart Box */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 text-white backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glowing Background Accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* ROOT NODE: BLOOD DONOR APP */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-sm sm:text-base tracking-wide shadow-lg shadow-red-600/30 flex items-center gap-2 border border-red-400/30 ring-4 ring-red-900/40">
            <Heart className="w-5 h-5 fill-current animate-pulse text-white" />
            <span>BLOOD DONOR APP (LIFELINK)</span>
          </div>

          {/* Central Stem Line */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-red-500 to-slate-700 my-1" />

          {/* Split Horizontal Bar */}
          <div className="w-full max-w-2xl h-0.5 bg-slate-700 relative hidden md:block">
            <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* TWO BRANCHES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {/* ================= BRANCH 1: NEED BLOOD? (SEEKER FLOW) ================= */}
          <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-red-950/20 border border-red-900/40 hover:border-red-600/50 transition-all group">
            {/* Header Node */}
            <div className="flex items-center justify-between pb-3 border-b border-red-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-base sm:text-lg font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-5 h-5 text-red-400" />
                  NEED BLOOD?
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-900/80 text-red-300 border border-red-700/50">
                Seeker Pathway
              </span>
            </div>

            {/* Step 1: No Login Needed */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <p className="text-xs font-black text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> No Login Needed
                </p>
                <p className="text-[11px] text-slate-400">Zero friction access for critical emergencies.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-red-500/70" />
            </div>

            {/* Step 2: Select Blood Group */}
            <button
              onClick={() => {
                if (onSelectBloodGroup) onSelectBloodGroup();
                else navigate('/search');
              }}
              className="w-full text-left p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-red-500/60 transition-all flex items-center justify-between group/btn cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 border border-red-800/60 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="text-xs font-black text-slate-100 group-hover/btn:text-red-400 transition-colors">
                    Select Blood Group
                  </p>
                  <p className="text-[11px] text-slate-400">A+, A-, B+, B-, AB+, AB-, O+, O-</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-1 rounded-md border border-red-800/60">
                Choose →
              </span>
            </button>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-red-500/70" />
            </div>

            {/* Step 3: Enable Location */}
            <button
              onClick={() => {
                if (onTriggerLocation) onTriggerLocation();
                else navigate('/search');
              }}
              className="w-full text-left p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-red-500/60 transition-all flex items-center justify-between group/btn cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 border border-red-800/60 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="text-xs font-black text-slate-100 group-hover/btn:text-red-400 transition-colors flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-red-400" /> Enable Location
                  </p>
                  <p className="text-[11px] text-slate-400">GPS proximity auto-detect or manual city filter</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-1 rounded-md border border-red-800/60">
                Locate →
              </span>
            </button>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-red-500/70" />
            </div>

            {/* Step 4: Find Nearby Donors (Terminal Node) */}
            <Link to="/search" className="block">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm text-center shadow-lg shadow-red-600/40 border border-red-400/40 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                <Search className="w-4 h-4" />
                <span>Find Nearby Donors Now</span>
              </div>
            </Link>
          </div>

          {/* ================= BRANCH 2: WANT TO DONATE? (DONOR FLOW) ================= */}
          <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-600/50 transition-all group">
            {/* Header Node */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-base sm:text-lg font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  WANT TO DONATE?
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                Donor Pathway
              </span>
            </div>

            {/* Step 1: Register as Donor */}
            <Link to="/donor-registration" className="block">
              <div className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 transition-all flex items-center justify-between group/btn cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-100 group-hover/btn:text-emerald-400 transition-colors">
                      Register as Donor
                    </p>
                    <p className="text-[11px] text-slate-400">Join verified hero network</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                  Register →
                </span>
              </div>
            </Link>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-emerald-500/70" />
            </div>

            {/* Step 2: Create Account */}
            <Link to="/register" className="block">
              <div className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 transition-all flex items-center justify-between group/btn cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-100 group-hover/btn:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Create Account
                    </p>
                    <p className="text-[11px] text-slate-400">Secure credentials & location details</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                  Sign Up →
                </span>
              </div>
            </Link>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-emerald-500/70" />
            </div>

            {/* Step 3: Donor Dashboard & Set Availability */}
            <Link to="/dashboard" className="block">
              <div className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 transition-all flex items-center justify-between group/btn cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-100 group-hover/btn:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" /> Donor Dashboard & Set Availability
                    </p>
                    <p className="text-[11px] text-slate-400">Toggle live availability status anytime</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                  Manage →
                </span>
              </div>
            </Link>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-emerald-500/70" />
            </div>

            {/* Step 4: Receive Requests (Terminal Node) */}
            <Link to="/request-history" className="block">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm text-center shadow-lg shadow-emerald-600/40 border border-emerald-400/40 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                <Bell className="w-4 h-4" />
                <span>Receive & Accept Emergency Requests</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
