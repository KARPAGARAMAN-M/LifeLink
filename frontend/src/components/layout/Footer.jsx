import { Link } from 'react-router-dom';
import { FaHeartbeat, FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="text-xl font-display font-bold text-white">LifeLink</span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              Connecting blood donors with recipients during emergencies. Every drop counts. Save lives with LifeLink.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/search', label: 'Find Donors' },
                { to: '/register', label: 'Register' },
                { to: '/donor-registration', label: 'Become a Donor' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blood Groups */}
          <div>
            <h3 className="text-white font-semibold mb-4">Blood Groups</h3>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <span key={bg} className="px-2 py-1 bg-primary-900/30 text-primary-400 rounded-lg text-xs font-bold text-center">
                  {bg}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3 mb-4">
              {[
                { icon: FaGithub, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaLinkedin, href: '#' },
                { icon: FaEnvelope, href: 'mailto:contact@lifelink.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-surface-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-sm text-surface-400">
              Emergency? Call: <span className="text-primary-400 font-semibold">108</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {currentYear} LifeLink. All rights reserved.
          </p>
          <p className="text-sm text-surface-500">
            Built with ❤️ for saving lives
          </p>
        </div>
      </div>
    </footer>
  );
}
