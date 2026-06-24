import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HiMenu, HiX, HiMoon, HiSun, HiUser, HiLogout, HiChevronDown } from 'react-icons/hi';
import { FaHeartbeat } from 'react-icons/fa';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Find Donors' },
  ];

  const authLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/request-history', label: 'Requests' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">LifeLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && authLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/admin')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-surface-600" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-200">{user?.name}</span>
                  <HiChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-2 animate-slide-down">
                    <div className="px-3 py-2 border-b border-surface-200 dark:border-surface-700 mb-1">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user?.name}</p>
                      <p className="text-xs text-surface-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <HiUser className="w-4 h-4" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <HiLogout className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
              {darkMode ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-surface-600" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path) ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-surface-600 dark:text-surface-300'
                }`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && authLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path) ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-surface-600 dark:text-surface-300'
                }`}>
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300">Admin</Link>
            )}
            <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600">Logout</button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-secondary flex-1 text-center !py-2 text-sm">Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center !py-2 text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
