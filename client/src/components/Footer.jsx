import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Medical Suitability Notice Banner */}
      <div className="bg-blood-950/80 border-b border-blood-900/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-blood-200 text-center font-medium">
          <ShieldAlert className="w-4 h-4 text-blood-400 flex-shrink-0" />
          <span>
            <strong>Medical Notice:</strong> Blood group matching in this system does not guarantee medical compatibility or donor eligibility. Certified healthcare professionals must verify suitability prior to transfusion.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blood-600 flex items-center justify-center text-white">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Life<span className="text-blood-500">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A comprehensive MERN full-stack application engineered to streamline voluntary blood donations, emergency blood requests, and donor discovery.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Award className="w-4 h-4 text-blood-400" />
              <span>Full-Stack Capstone Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/find-donors" className="hover:text-blood-400 transition">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/create-request" className="hover:text-blood-400 transition">
                  Submit Blood Request
                </Link>
              </li>
              <li>
                <Link to="/donor-profile" className="hover:text-blood-400 transition">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blood-400 transition">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Blood Groups Information */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Blood Groups
            </h4>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold text-slate-300">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <Link
                  key={group}
                  to={`/find-donors?bloodGroup=${encodeURIComponent(group)}`}
                  className="p-1.5 rounded bg-slate-800 text-center hover:bg-blood-700 hover:text-white transition"
                >
                  {group}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              O- is the universal red cell donor; AB+ is the universal plasma donor.
            </p>
          </div>

          {/* Project & Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• MongoDB Atlas with Mongoose</li>
              <li>• Express.js & Node.js REST API</li>
              <li>• React 18, Vite & Tailwind CSS</li>
              <li>• JWT Auth & bcrypt Encryption</li>
              <li>• Mobile Responsive Healthcare UI</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LifePulse Blood Donor Finder System. Developed for academic demonstration.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care to save lives</span>
            <Heart className="w-3.5 h-3.5 fill-blood-500 text-blood-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
