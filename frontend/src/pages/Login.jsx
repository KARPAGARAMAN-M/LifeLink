import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, LogIn, ShieldCheck, Users, CheckCircle2 } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Login() {
  // Always initialize login fields as empty strings
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset form fields explicitly on component mount/page refresh
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.name}!`);
      // Clear form state before redirecting
      setEmail('');
      setPassword('');
      navigate('/dashboard');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 my-auto">

        {/* Left Branding Section (~45% width on desktop) */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-br from-red-950 via-slate-900 to-red-900 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Crimson Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-800/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding Logo */}
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

            {/* Core Message */}
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

          {/* Trust Indicators */}
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

        {/* Right Login Section (~55% width on desktop) */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-8 bg-white dark:bg-slate-900">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, Donor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Sign in to manage your donor account and help save lives.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            {/* Dummy hidden inputs to intercept browser password manager auto-fill */}
            <input type="text" name="fake_username_prevent_autofill" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <input type="password" name="fake_password_prevent_autofill" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <Input
              id="login-email"
              name="donor_email_login"
              label="Email Address *"
              type="email"
              icon={Mail}
              placeholder="e.g. donor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              preventAutofill={true}
              autoComplete="off"
            />

            <Input
              id="login-password"
              name="donor_password_login"
              label="Password *"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              preventAutofill={true}
              autoComplete="new-password"
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
                Sign In
              </Button>
            </div>
          </form>

          {/* Registration Link Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-red-600 dark:text-red-400 font-extrabold hover:text-red-700 dark:hover:text-red-300 hover:underline transition-colors"
              >
                Become a donor
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
