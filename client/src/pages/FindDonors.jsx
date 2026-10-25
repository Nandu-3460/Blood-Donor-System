import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { donorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldAlert,
  User,
  CheckCircle,
  Calendar,
  AlertCircle,
  Filter,
  EyeOff,
  Lock,
} from 'lucide-react';
import Alert from '../components/Alert';
import { formatDate } from '../utils/formatDate';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function FindDonors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchDonors = async (bgFilter = bloodGroup, cityFilter = city) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (bgFilter) params.bloodGroup = bgFilter;
      if (cityFilter && cityFilter.trim()) params.city = cityFilter.trim();

      const res = await donorAPI.search(params);
      setDonors(res.data.donors || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch donors from database.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform initial search or sync with URL query
  useEffect(() => {
    const bgFromUrl = searchParams.get('bloodGroup') || '';
    const cityFromUrl = searchParams.get('city') || '';
    setBloodGroup(bgFromUrl);
    setCity(cityFromUrl);
    fetchDonors(bgFromUrl, cityFromUrl);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (bloodGroup) params.bloodGroup = bloodGroup;
    if (city.trim()) params.city = city.trim();
    setSearchParams(params);
    fetchDonors(bloodGroup, city);
  };

  const handleReset = () => {
    setBloodGroup('');
    setCity('');
    setSearchParams({});
    fetchDonors('', '');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Blood Donors
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Locate voluntary donors registered in your area. Contact them for direct voluntary donation or emergency response.
        </p>
      </div>

      {/* Medical Suitability Notice */}
      <div className="p-4 mb-6 rounded-xl bg-blood-50 border border-blood-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blood-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blood-800 leading-relaxed">
          <strong>Important Medical Notice:</strong> A blood group match in search results does not guarantee medical compatibility, cross-match safety, or donor eligibility. Proper screening and testing must always be conducted by accredited hospital or blood bank staff.
        </p>
      </div>

      {/* Search Filter Box */}
      <div className="card p-6 mb-8 bg-white border border-slate-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="label">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="input-field"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="label">City / Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Mumbai, Delhi, Pune, Chennai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-2.5 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search'}
            </button>
            {(bloodGroup || city) && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary !py-2.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Search Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          Available Voluntary Donors
          {!loading && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
              {donors.length}
            </span>
          )}
        </h2>
        {bloodGroup && (
          <span className="text-xs text-slate-500">
            Filtered by group: <strong>{bloodGroup}</strong>
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Querying MongoDB Atlas for donors...</p>
        </div>
      )}

      {/* Empty State / No Results */}
      {!loading && searched && donors.length === 0 && (
        <div className="card p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Matching Donors Found</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            We couldn't find any available donors matching <strong>{bloodGroup || 'all groups'}</strong> in <strong>{city || 'all cities'}</strong>.
            You can submit an emergency Blood Request to alert the whole network!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={handleReset} className="btn-secondary text-xs">
              Clear Search Filters
            </button>
            <Link to="/create-request" className="btn-primary text-xs">
              Submit Blood Request Now
            </Link>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && donors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="card p-6 border-slate-200 hover:border-blood-300 relative flex flex-col justify-between"
            >
              <div>
                {/* Header: Blood group + Availability */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blood-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blood-600/30">
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {donor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{donor.city}, {donor.state}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Available
                  </span>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Donation:</span>
                    <span className="font-medium text-slate-700">
                      {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Privacy Setting:</span>
                    <span className="font-medium text-slate-700">
                      {donor.contactVisibility === 'Always'
                        ? 'Public Contact'
                        : donor.contactVisibility === 'RegisteredOnly'
                        ? 'Verified Members Only'
                        : 'On Request'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Action footer */}
              <div className="mt-4 pt-2">
                {donor.phone ? (
                  <a
                    href={`tel:${donor.phone}`}
                    className="w-full btn-primary text-xs !py-2.5 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Donor: {donor.phone}
                  </a>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                    {!isAuthenticated ? (
                      <Link
                        to="/login"
                        className="text-xs font-semibold text-blood-600 hover:text-blood-800 flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Sign in to view contact number
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        {donor.phoneHiddenReason || 'Contact via blood request'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
