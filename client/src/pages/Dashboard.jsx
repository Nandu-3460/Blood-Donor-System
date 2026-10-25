import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, donorAPI } from '../services/api';
import {
  Heart,
  Droplet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Search,
  FileText,
  User,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import Alert from '../components/Alert';
import { formatDate } from '../utils/formatDate';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardAPI.getSummary();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleAvailability = async () => {
    if (!data?.donorProfile) return;
    try {
      setTogglingAvailability(true);
      const newStatus = !data.donorProfile.availabilityStatus;
      await donorAPI.toggleAvailability(newStatus);
      await refreshUser();
      await fetchDashboard();
      setSuccessMsg(`Your donor availability is now ${newStatus ? 'AVAILABLE' : 'UNAVAILABLE'}.`);
    } catch (err) {
      setError(err.message || 'Failed to update availability status.');
    } finally {
      setTogglingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading your real-time dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalCreated: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    acceptedByMe: 0,
    matchingOpenRequests: 0,
  };

  const donorProfile = data?.donorProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>. Here is your blood donation & request activity.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/create-request" className="btn-primary text-sm !py-2 !px-4">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            New Blood Request
          </Link>
          <Link to="/find-donors" className="btn-secondary text-sm !py-2 !px-4">
            <Search className="w-4 h-4 mr-1.5" />
            Find Donors
          </Link>
          <button
            onClick={fetchDashboard}
            title="Refresh dashboard data"
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {successMsg && (
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      )}

      {/* Donor Profile Highlight / Callout */}
      {donorProfile ? (
        <div className="card p-6 mb-8 bg-gradient-to-r from-blood-50 via-white to-slate-50 border-blood-200/60 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blood-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blood-600/30 flex-shrink-0">
                {donorProfile.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Registered Blood Donor
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      donorProfile.availabilityStatus
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {donorProfile.availabilityStatus ? 'Ready to Donate' : 'Temporarily Unavailable'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {donorProfile.city}, {donorProfile.state}
                  </span>
                  <span>•</span>
                  <span>Contact Visibility: {donorProfile.contactVisibility}</span>
                  <span>•</span>
                  <span>
                    Last Donation: {donorProfile.lastDonationDate ? formatDate(donorProfile.lastDonationDate) : 'None recorded'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg border transition ${
                  donorProfile.availabilityStatus
                    ? 'bg-white border-amber-300 text-amber-800 hover:bg-amber-50'
                    : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {togglingAvailability
                  ? 'Updating...'
                  : donorProfile.availabilityStatus
                  ? 'Set to Unavailable'
                  : 'Set to Available'}
              </button>
              <Link
                to="/donor-profile"
                className="text-xs sm:text-sm font-medium text-blood-700 hover:text-blood-800 underline underline-offset-4"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6 mb-8 bg-blood-50/50 border-blood-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blood-100 text-blood-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 fill-blood-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">You haven't registered as a blood donor yet</h4>
              <p className="text-xs text-slate-600">
                Pledge your blood group so hospital patients and seekers in your city can find you.
              </p>
            </div>
          </div>
          <Link to="/donor-profile" className="btn-primary text-xs sm:text-sm flex-shrink-0">
            Complete Donor Profile
          </Link>
        </div>
      )}

      {/* Metrics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Created
            </span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats.totalCreated}
          </div>
          <p className="text-xs text-slate-500 mt-1">Requests submitted by you</p>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Pending
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats.pending}
          </div>
          <p className="text-xs text-slate-500 mt-1">Awaiting donor response</p>
        </div>

        <div className="card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Accepted
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats.accepted}
          </div>
          <p className="text-xs text-slate-500 mt-1">Pledged by a donor</p>
        </div>

        <div className="card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats.completed}
          </div>
          <p className="text-xs text-slate-500 mt-1">Transfusion completed</p>
        </div>
      </div>

      {/* Donor section: Requests Accepted by me (if any) */}
      {data?.acceptedByMeRequests && data.acceptedByMeRequests.length > 0 && (
        <div className="card p-6 mb-8 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Pledged Donations (Accepted by You)
              </h3>
              <p className="text-xs text-slate-500">
                Requests you have committed to donate blood for. Please coordinate with the hospital.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {data.acceptedByMeRequests.length} Active Commitment
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {data.acceptedByMeRequests.map((req) => (
              <div key={req._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blood-700">{req.bloodGroup}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-sm font-semibold text-slate-900">{req.hospitalName}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Patient: {req.patientReference} ({req.unitsRequired} units) in {req.city}, {req.state} • Required by: {formatDate(req.requiredBy)}
                  </p>
                </div>
                <Link
                  to={`/requests/${req.requestId || req._id}`}
                  className="btn-outline-blood text-xs !py-1.5 !px-3 self-start sm:self-auto"
                >
                  View Details & Contact
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Requests Created Table */}
      <div className="card overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Recent Blood Requests</h3>
            <p className="text-xs text-slate-500">Real-time status updates directly from MongoDB</p>
          </div>
          <Link
            to="/my-requests"
            className="text-xs font-semibold text-blood-600 hover:text-blood-800 flex items-center gap-1"
          >
            View All ({stats.totalCreated}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentRequests && data.recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Request ID</th>
                  <th className="px-6 py-3">Blood Group</th>
                  <th className="px-6 py-3">Hospital / City</th>
                  <th className="px-6 py-3">Urgency</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                      {req.requestId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blood-100 text-blood-700 font-bold text-xs">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{req.hospitalName}</div>
                      <div className="text-xs text-slate-400">
                        {req.city}, {req.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <UrgencyBadge urgency={req.urgency} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/requests/${req.requestId || req._id}`}
                        className="text-xs font-semibold text-blood-600 hover:text-blood-800 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Blood Requests Created Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              If you or someone you know requires blood, create a new request and it will be visible to donors.
            </p>
            <Link to="/create-request" className="btn-primary text-xs mt-4 inline-flex">
              Create First Blood Request
            </Link>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/find-donors"
          className="card p-5 hover:border-blood-300 group flex items-start gap-4 transition"
        >
          <div className="p-3 rounded-xl bg-blood-50 text-blood-600 group-hover:bg-blood-600 group-hover:text-white transition">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blood-600 transition">
              Find Donors
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Search voluntary blood donors by blood group and city.
            </p>
          </div>
        </Link>

        <Link
          to="/create-request"
          className="card p-5 hover:border-blood-300 group flex items-start gap-4 transition"
        >
          <div className="p-3 rounded-xl bg-blood-50 text-blood-600 group-hover:bg-blood-600 group-hover:text-white transition">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blood-600 transition">
              Create Request
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit patient details, units required, and hospital location.
            </p>
          </div>
        </Link>

        <Link
          to="/my-requests"
          className="card p-5 hover:border-blood-300 group flex items-start gap-4 transition"
        >
          <div className="p-3 rounded-xl bg-blood-50 text-blood-600 group-hover:bg-blood-600 group-hover:text-white transition">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blood-600 transition">
              My Requests
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Track request statuses, acceptances, and completion workflows.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
