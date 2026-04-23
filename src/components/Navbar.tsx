import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { name: 'Features', href: '/features', isRoute: true },
  { name: 'Pricing', href: '/plans', isRoute: true },
  { name: 'Security', href: '/security', isRoute: true },
  { name: 'Blog', href: '/blog', isRoute: true },
  { name: 'About', href: '/about', isRoute: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070A12]/95 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center shadow-lg shadow-[#2D6BFF]/20 group-hover:shadow-[#2D6BFF]/30 transition-shadow">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[#F4F6FF] font-semibold text-lg tracking-tight">AI Invest</span>
              <span className="text-[#2D6BFF] font-semibold text-lg">Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#F4F6FF] bg-white/[0.06]'
                    : 'text-[#8B95A8] hover:text-[#F4F6FF] hover:bg-white/[0.03]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors focus:outline-none">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <span className="text-[#F4F6FF] text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-[#5A6578]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#141B2D] border-white/[0.06] w-48">
                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="text-[#F4F6FF] hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06]"
                  >
                    <TrendingUp className="w-4 h-4 mr-2 text-[#8B95A8]" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="text-[#F4F6FF] hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06]"
                  >
                    <User className="w-4 h-4 mr-2 text-[#8B95A8]" />
                    Profile
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-white/[0.06]" />
                      <DropdownMenuItem
                        onClick={() => navigate('/admin/dashboard')}
                        className="text-blue-400 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06]"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#EF4444] hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#8B95A8] hover:text-[#F4F6FF] transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#F4F6FF]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#070A12]/98 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#F4F6FF] bg-white/[0.06]'
                    : 'text-[#8B95A8] hover:text-[#F4F6FF] hover:bg-white/[0.03]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-[#F4F6FF] font-medium bg-white/[0.06]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-[#F4F6FF] font-medium"
                  >
                    Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-blue-400 font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-[#EF4444] font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-[#8B95A8] font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary block text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
