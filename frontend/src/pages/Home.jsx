import { Link } from 'react-router-dom';
import { FaHeartbeat, FaSearch, FaHandHoldingHeart, FaUserPlus, FaTint, FaHospital, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { HiArrowRight, HiShieldCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-hidden">
      {/* ===== Hero Section ===== */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-gradient opacity-90" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <FaHeartbeat className="text-primary-300 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Every Drop Counts • Save Lives Today</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold text-white mb-6 animate-slide-up leading-tight">
              Connect <span className="text-primary-300">Blood Donors</span>
              <br />
              with Those in Need
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              LifeLink bridges the gap between blood donors and recipients during emergencies.
              Register as a donor, find nearby matches, and respond to urgent requests instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/search" className="btn-primary !py-4 !px-8 text-lg flex items-center gap-2">
                    <FaSearch /> Find Donors <HiArrowRight />
                  </Link>
                  <Link to="/donor-registration" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary-700 !py-4 !px-8 text-lg">
                    Become a Donor
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary !py-4 !px-8 text-lg flex items-center gap-2">
                    Get Started <HiArrowRight />
                  </Link>
                  <Link to="/search" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary-700 !py-4 !px-8 text-lg">
                    Find Donors
                  </Link>
                </>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              {[
                { value: '1000+', label: 'Donors' },
                { value: '500+', label: 'Lives Saved' },
                { value: '50+', label: 'Cities' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" className="fill-surface-50 dark:fill-surface-950" />
          </svg>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-20 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">
              How <span className="gradient-text">LifeLink</span> Works
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Three simple steps to connect donors and recipients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaUserPlus,
                title: 'Register',
                desc: 'Create your account and register as a blood donor with your blood group and location.',
                color: 'from-primary-500 to-primary-700',
                step: '01',
              },
              {
                icon: FaSearch,
                title: 'Search & Request',
                desc: 'Search for available donors by blood group and location. Send blood requests instantly.',
                color: 'from-accent-500 to-accent-700',
                step: '02',
              },
              {
                icon: FaHandHoldingHeart,
                title: 'Save Lives',
                desc: 'Donors accept requests, coordinate with recipients, and complete the donation.',
                color: 'from-emerald-500 to-emerald-700',
                step: '03',
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 text-center card-hover group relative">
                <span className="absolute top-4 right-4 text-6xl font-display font-bold text-surface-100 dark:text-surface-800 group-hover:text-primary-100 dark:group-hover:text-primary-900/30 transition-colors">
                  {item.step}
                </span>
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-surface-500 dark:text-surface-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Blood Group Info ===== */}
      <section className="py-20 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">
              Blood Group <span className="gradient-text">Compatibility</span>
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Understanding which blood types can donate to and receive from others
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { bg: 'A+', canGive: 'A+, AB+', canReceive: 'A+, A-, O+, O-' },
              { bg: 'A-', canGive: 'A+, A-, AB+, AB-', canReceive: 'A-, O-' },
              { bg: 'B+', canGive: 'B+, AB+', canReceive: 'B+, B-, O+, O-' },
              { bg: 'B-', canGive: 'B+, B-, AB+, AB-', canReceive: 'B-, O-' },
              { bg: 'AB+', canGive: 'AB+', canReceive: 'All Types' },
              { bg: 'AB-', canGive: 'AB+, AB-', canReceive: 'A-, B-, AB-, O-' },
              { bg: 'O+', canGive: 'O+, A+, B+, AB+', canReceive: 'O+, O-' },
              { bg: 'O-', canGive: 'All Types', canReceive: 'O-' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-5 card-hover text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white font-bold text-lg">{item.bg}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-surface-400 uppercase tracking-wider">Gives to</p>
                    <p className="font-semibold text-surface-700 dark:text-surface-200">{item.canGive}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-400 uppercase tracking-wider">Receives from</p>
                    <p className="font-semibold text-surface-700 dark:text-surface-200">{item.canReceive}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">
              Why Choose <span className="gradient-text">LifeLink</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FaTint, title: 'Real-time Availability', desc: 'Know which donors are currently available to donate blood in your area.' },
              { icon: FaHospital, title: 'Hospital Integration', desc: 'Specify hospital details when creating blood requests for seamless coordination.' },
              { icon: HiShieldCheck, title: 'Verified Donors', desc: 'All donors are verified through our secure registration process.' },
              { icon: FaUsers, title: 'Community Driven', desc: 'Join a growing community of blood donors committed to saving lives.' },
              { icon: FaCheckCircle, title: 'Request Tracking', desc: 'Track your blood requests from creation to completion in real-time.' },
              { icon: FaHeartbeat, title: 'Emergency Alerts', desc: 'Critical requests are highlighted and prioritized for urgent attention.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 card-hover flex gap-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-surface-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-90" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join LifeLink today and become part of a life-saving community. Your blood donation can save up to three lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-700 hover:bg-surface-100 font-bold py-4 px-8 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2 text-lg">
              Join LifeLink Now <HiArrowRight />
            </Link>
            <Link to="/search" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary-700 !py-4 !px-8 text-lg">
              Find Donors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
