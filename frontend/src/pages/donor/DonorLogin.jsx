import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function DonorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, 'DONOR');
      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email/phone or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
            <span>LifeLink Blood Donor Portal</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Your Donation Can Save a Life
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Manage your availability and respond to people who need your blood.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs font-bold flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Email / Phone Number
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="donor@example.com or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-rose-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={Heart}
              className="w-full py-3.5 font-black text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-600/30 justify-center rounded-2xl"
            >
              LOGIN AS DONOR
            </Button>
          </form>

          {/* Secondary Option: Register */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400 font-medium">
              Want to save lives?
            </p>
            <Link
              to="/donor/register"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider"
            >
              <span>REGISTER AS DONOR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Your privacy is protected. Donors control their availability at all times.</span>
        </div>

      </div>
    </div>
  );
}
