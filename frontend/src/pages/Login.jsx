import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, LogIn, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@lifelink.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Left Side: Medical Branding Banner */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-br from-red-900 via-red-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Life<span className="text-red-400">Link</span>
              </span>
            </Link>

            <div className="pt-8 space-y-3">
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                Emergency Blood Match System
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with compatible blood donors and broadcast urgent requests instantly across regions.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-3 border-t border-white/10 relative z-10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>JWT Authenticated Session</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              <span>Verified Donors Network</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in with your credentials to access your LifeLink dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="e.g. name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your secret password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              id="login-submit"
              type="submit"
              variant="primary"
              icon={LogIn}
              isLoading={loading}
              className="w-full py-3 font-black text-sm shadow-lg shadow-red-600/30"
            >
              Sign In to Account
            </Button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Fill
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('user')}
                className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-slate-700 dark:text-slate-300 font-bold transition-all text-left truncate"
              >
                👤 User Demo
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-slate-700 dark:text-slate-300 font-bold transition-all text-left truncate"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 dark:text-red-400 font-bold hover:underline">
              Create account now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
