import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Droplet, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function SeekerLogin() {
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
      await login(email, password, 'SEEKER');
      navigate('/seeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email/phone or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-black uppercase tracking-wider">
            <Droplet className="w-3.5 h-3.5 fill-current text-red-500" />
            <span>LifeLink Blood Seeker Portal</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Find Blood When It Matters Most
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Connect with verified blood donors near you.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-950/90 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
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
                  placeholder="name@example.com or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900/80 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
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
                  className="bg-slate-900/80 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-red-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <Button
              type="submit"
              variant="danger"
              size="lg"
              loading={loading}
              icon={Search}
              className="w-full py-3.5 font-black text-sm shadow-xl shadow-red-600/30 justify-center rounded-2xl"
            >
              LOGIN AS BLOOD SEEKER
            </Button>
          </form>

          {/* Secondary Option: Register */}
          <div className="pt-4 border-t border-slate-700/80 text-center space-y-3">
            <p className="text-xs text-slate-400 font-medium">
              New to LifeLink?
            </p>
            <Link
              to="/seeker/register"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
            >
              <span>CREATE SEEKER ACCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Need donor help immediately? Emergency request features available inside.</span>
        </div>

      </div>
    </div>
  );
}
