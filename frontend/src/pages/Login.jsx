import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, LogIn, ShieldCheck, Users, CheckCircle2, UserPlus } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email/phone and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.name}!`);
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email/phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 my-auto">
        {/* Left Branding Section */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-br from-red-950 via-slate-900 to-red-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-800/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-current animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Life<span className="text-red-500">Link</span>
                </span>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                  Blood Donation Platform
                </p>
              </div>
            </Link>

            <div className="pt-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/60 border border-red-700/40 text-red-300 text-xs font-extrabold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-current text-red-400" /> Save Lives Today
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Every donation <br />
                <span className="text-red-400">can save a life.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Connect with verified blood donors and help make critical blood available when it matters most.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 relative z-10 space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Secure Donor Accounts</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
              <Users className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Verified Donor Network</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Real-Time Proximity Matcher</span>
            </div>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-8 bg-white dark:bg-slate-900">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Donor Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Sign in using your email address or phone number to manage your donor profile and availability.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            <Input
              id="login-email"
              name="email"
              label="Email / Phone *"
              type="text"
              icon={Mail}
              placeholder="Enter your registered email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            <Input
              id="login-password"
              name="password"
              label="Password *"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <div className="pt-2">
              <Button
                id="login-submit"
                type="submit"
                variant="primary"
                icon={LogIn}
                isLoading={loading}
                className="w-full py-3.5 font-black text-sm shadow-xl shadow-red-600/30 justify-center rounded-xl"
              >
                LOGIN
              </Button>
            </div>
          </form>

          {/* Registration CTA Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">New donor?</p>
            <Link to="/donor-registration" className="block w-full">
              <Button
                variant="outline"
                icon={UserPlus}
                className="w-full justify-center py-3 text-red-600 border-red-500/40 dark:text-red-400 font-black hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                REGISTER AS A DONOR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
