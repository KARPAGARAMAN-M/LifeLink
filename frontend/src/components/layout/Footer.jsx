import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Emergency hotline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Life<span className="text-red-500">Link</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              LifeLink is a high-speed emergency blood donor connecting platform. We empower communities to request, match, and donate blood when every minute counts.
            </p>
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-red-950/60 border border-red-900/50 text-red-300">
              <PhoneCall className="w-5 h-5 text-red-400 animate-pulse" />
              <div>
                <p className="text-[10px] uppercase font-bold text-red-400">Emergency Helpline</p>
                <p className="text-sm font-black text-white">+1 (800) 543-LINK / 108</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">
                  LifeLink
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-red-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-red-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/search" className="hover:text-red-400 transition-colors">
                  Find Blood
                </Link>
              </li>
              <li>
                <Link to="/donor-registration" className="hover:text-red-400 transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-red-400 transition-colors">
                  Donor Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-4">Trust & Compliance</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Encrypted Credentials
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Contact Privacy Protected
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Donor Network
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-4">Medical Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400" /> support@lifelink.org
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400" /> Medical Hub, Central City
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LifeLink Emergency System. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Emergency Disclaimer: Final donor eligibility and blood safety check must be performed by qualified healthcare staff.
          </p>
        </div>
      </div>
    </footer>
  );
}
