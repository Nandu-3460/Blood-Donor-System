import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  PlusCircle,
  FileText,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
      isActive
        ? 'text-blood-700 bg-blood-50 font-semibold'
        : 'text-slate-600 hover:text-blood-600 hover:bg-slate-50'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
      isActive
        ? 'text-blood-700 bg-blood-50 font-semibold'
        : 'text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blood-700 to-blood-500 flex items-center justify-center text-white shadow-md shadow-blood-500/20 group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1">
                Life<span className="text-blood-600">Pulse</span>
              </span>
              <span className="text-[10px] block text-slate-400 font-medium tracking-wide uppercase">
                Donor Finder & Request
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/find-donors" className={navLinkClasses}>
              Find Donors
            </NavLink>
            <NavLink to="/create-request" className={navLinkClasses}>
              Request Blood
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/my-requests" className={navLinkClasses}>
                  My Requests
                </NavLink>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  Dashboard
                </NavLink>
              </>
            )}
            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>
          </nav>

          {/* Desktop Right Side CTA / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Donor status tag */}
                {user?.donorProfile ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.donorProfile.availabilityStatus
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.donorProfile.availabilityStatus
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                    Donor: {user.donorProfile.bloodGroup}
                  </span>
                ) : (
                  <Link
                    to="/donor-profile"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blood-50 text-blood-700 hover:bg-blood-100 border border-blood-200 transition"
                  >
                    <Heart className="w-3.5 h-3.5 fill-blood-500 text-blood-500" />
                    Become a Donor
                  </Link>
                )}

                {/* Profile Link */}
                <Link
                  to="/donor-profile"
                  className="p-2 text-slate-600 hover:text-blood-600 hover:bg-slate-100 rounded-lg transition"
                  title="Manage Donor Profile"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blood-600 hover:bg-slate-50 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm !py-2 !px-4"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <NavLink
            to="/"
            className={mobileNavLinkClasses}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/find-donors"
            className={mobileNavLinkClasses}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="w-4 h-4 text-blood-600" />
            Find Donors
          </NavLink>
          <NavLink
            to="/create-request"
            className={mobileNavLinkClasses}
            onClick={() => setMobileMenuOpen(false)}
          >
            <PlusCircle className="w-4 h-4 text-blood-600" />
            Request Blood
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/my-requests"
                className={mobileNavLinkClasses}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4 text-blood-600" />
                My Requests
              </NavLink>
              <NavLink
                to="/dashboard"
                className={mobileNavLinkClasses}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-blood-600" />
                Dashboard
              </NavLink>
              <NavLink
                to="/donor-profile"
                className={mobileNavLinkClasses}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-4 h-4 text-blood-600" />
                Donor Profile & Settings
              </NavLink>
            </>
          )}
          <NavLink
            to="/about"
            className={mobileNavLinkClasses}
            onClick={() => setMobileMenuOpen(false)}
          >
            About System
          </NavLink>

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-600 px-3">
                  Signed in as <span className="font-semibold text-slate-900">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="btn-secondary text-sm text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
