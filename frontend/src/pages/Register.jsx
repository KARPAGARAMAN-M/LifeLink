import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Lock, UserPlus, ShieldCheck, HeartHandshake } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully! Welcome to LifeLink!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Left Side: Branding */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-br from-red-900 via-red-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
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
                Join the Life-Saving Network
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your secure account to request blood in emergencies or register as a life-saving donor.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-3 border-t border-white/10 relative z-10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Password Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              <span>Instant Match Notifications</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create LifeLink Account</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your details below to register.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="register-name"
              label="Full Name"
              name="name"
              type="text"
              icon={User}
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              id="register-email"
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="e.g. name@domain.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              id="register-password"
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Input
              id="register-confirm"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button
              id="register-submit"
              type="submit"
              variant="primary"
              icon={UserPlus}
              isLoading={loading}
              className="w-full py-3 font-black text-sm shadow-lg shadow-red-600/30"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 dark:text-red-400 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
