import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 rounded-3xl bg-blood-100 text-blood-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="text-sm font-bold text-blood-600 uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The requested page could not be found. It may have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary text-sm flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link to="/find-donors" className="btn-secondary text-sm">
            Find Blood Donors
          </Link>
        </div>
      </div>
    </div>
  );
}
