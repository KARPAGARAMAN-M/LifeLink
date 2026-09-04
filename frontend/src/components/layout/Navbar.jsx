import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';
import {
  Heart,
  Search,
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  AlertCircle,
  Clock,
  History,
  Activity,
  SearchCode,
  Droplet
} from 'lucide-react';
import Button from '../common/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // On Welcome page (/), hide global top navbar or render clean header
  if (location.pathname === '/') return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-md border-b border-slate-800 py-2.5'
          : 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Life<span className="text-red-500">Link</span>
                </span>
                {isAuthenticated ? (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-rose-950 text-rose-300 border border-rose-800">
                    🩸 Donor Portal
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-red-950 text-red-300 border border-red-900">
                    Emergency
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/40">
            {isAuthenticated ? (
              /* ================= AUTHENTICATED DONOR NAV ================= */
              <>
                <Link
                  to="/donor/dashboard"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/donor/dashboard')
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                <Link
                  to="/donor/requests"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/donor/requests')
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Blood Requests
                </Link>

                <Link
                  to="/donor/availability"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/donor/availability')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-400 hover:bg-emerald-950/40'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  My Availability
                </Link>

                <Link
                  to="/donor/donation-history"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/donor/donation-history')
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Donation History
                </Link>
              </>
            ) : (
              /* ================= PUBLIC / SEEKER (NO AUTH) NAV ================= */
              <>
                <Link
                  to="/find-blood"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/find-blood')
                      ? 'bg-red-600 text-white shadow-sm font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Find Blood
                </Link>

                <Link
                  to="/emergency-request"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/emergency-request')
                      ? 'bg-red-600 text-white shadow-sm font-black'
                      : 'text-red-400 hover:bg-red-950/40'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
                  Emergency Request
                </Link>

                <Link
                  to="/track-request"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive('/track-request')
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <SearchCode className="w-3.5 h-3.5 text-amber-400" />
                  Track Request
                </Link>
              </>
            )}
          </div>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Notification Bell for Donors */}
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              /* Authenticated Donor Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-extrabold text-white max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-950 text-rose-300 border border-rose-800">
                        Blood Donor Account
                      </span>
                    </div>

                    <Link
                      to="/donor/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Donor Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public Seeker & Donor Buttons */
              <div className="flex items-center gap-2">
                <Link to="/find-blood">
                  <Button size="sm" variant="danger" icon={Search} className="font-black shadow-lg shadow-red-600/30">
                    Find Blood Near Me
                  </Button>
                </Link>

                <Link to="/donor/login">
                  <Button size="sm" variant="secondary" icon={Heart} className="font-extrabold bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-900/60">
                    Donor Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 mt-2 shadow-2xl animate-fadeIn">
          {isAuthenticated ? (
            /* Mobile Donor Options */
            <>
              <Link to="/donor/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-800">
                <LayoutDashboard className="w-4 h-4 text-rose-500" /> Dashboard
              </Link>
              <Link to="/donor/requests" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-800">
                <FileText className="w-4 h-4 text-rose-500" /> Blood Requests
              </Link>
              <Link to="/donor/availability" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-400 bg-emerald-950/30">
                <Activity className="w-4 h-4 text-emerald-500" /> My Availability
              </Link>
              <Link to="/donor/donation-history" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-800">
                <History className="w-4 h-4 text-rose-500" /> Donation History
              </Link>
              <Link to="/donor/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-800">
                <User className="w-4 h-4 text-rose-500" /> Donor Profile
              </Link>
              <div className="pt-2 border-t border-slate-800">
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-center text-red-400">
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            /* Mobile Public Options */
            <div className="space-y-2 pt-2">
              <Link to="/find-blood" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600">
                <Search className="w-4 h-4" /> Find Blood Near You
              </Link>
              <Link to="/emergency-request" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-950/60 border border-red-800">
                <AlertCircle className="w-4 h-4 text-red-500" /> Emergency Request
              </Link>
              <Link to="/track-request" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-amber-400 bg-slate-800">
                <SearchCode className="w-4 h-4 text-amber-400" /> Track Request Status
              </Link>
              <div className="pt-2 border-t border-slate-800">
                <Link to="/donor/login" className="block w-full text-center py-2.5 rounded-xl bg-slate-800 text-rose-400 font-bold border border-rose-900/60">
                  Donor Login / Registration
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
