import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donorAPI } from '../services/api';
import {
  Heart,
  Droplet,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Alert from '../components/Alert';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorProfilePage() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';

  const [formData, setFormData] = useState({
    bloodGroup: '',
    city: '',
    state: '',
    phone: '',
    availabilityStatus: true,
    lastDonationDate: '',
    isVisibleInSearch: true,
    contactVisibility: 'RegisteredOnly',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.donorProfile) {
      const p = user.donorProfile;
      setFormData({
        bloodGroup: p.bloodGroup || '',
        city: p.city || '',
        state: p.state || '',
        phone: p.phone || '',
        availabilityStatus: p.availabilityStatus !== undefined ? p.availabilityStatus : true,
        lastDonationDate: p.lastDonationDate
          ? new Date(p.lastDonationDate).toISOString().split('T')[0]
          : '',
        isVisibleInSearch: p.isVisibleInSearch !== undefined ? p.isVisibleInSearch : true,
        contactVisibility: p.contactVisibility || 'RegisteredOnly',
      });
    }
    setFetching(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.bloodGroup || !formData.city.trim() || !formData.state.trim() || !formData.phone.trim()) {
      setError('Please provide blood group, city, state, and contact phone number.');
      return;
    }

    try {
      setLoading(true);
      await donorAPI.saveProfile({
        ...formData,
        city: formData.city.trim(),
        state: formData.state.trim(),
        phone: formData.phone.trim(),
        lastDonationDate: formData.lastDonationDate || null,
      });

      await refreshUser();
      setSuccess('Donor profile saved and synchronized with database successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update donor profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blood-50 text-blood-700 text-xs font-bold mb-2">
          <Heart className="w-3.5 h-3.5 fill-blood-600" />
          Voluntary Blood Donor System
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Donor Profile & Privacy Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Control your donation status, location availability, and contact visibility.
        </p>
      </div>

      {isWelcome && (
        <Alert
          type="info"
          message="Welcome to LifePulse! Please complete your blood group and location details below so hospital patients in need can reach you."
        />
      )}

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="card p-6 sm:p-8 bg-white border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Full Name (Readonly display from account) */}
          <div>
            <label className="label">Registered Account Name</label>
            <input
              type="text"
              disabled
              value={user?.name || ''}
              className="input-field bg-slate-100 text-slate-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Derived from your account registration credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Blood Group */}
            <div>
              <label className="label">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Droplet className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <select
                  required
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="input-with-icon"
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="label">
                Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="label">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="e.g. Mumbai, Bangalore, Pune"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="label">
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="state"
                placeholder="e.g. Maharashtra, Karnataka"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Last Donation Date */}
            <div>
              <label className="label">Last Donation Date (Optional)</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="input-with-icon"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Healthy donors generally wait 90 days (3 months) between whole blood donations.
              </p>
            </div>

            {/* Contact Visibility Preference */}
            <div>
              <label className="label">Contact Visibility Preference</label>
              <select
                name="contactVisibility"
                value={formData.contactVisibility}
                onChange={handleChange}
                className="input-field"
              >
                <option value="RegisteredOnly">Registered Users Only (Recommended)</option>
                <option value="Always">Public (Visible to everyone)</option>
                <option value="OnRequest">On Request Only (Hidden from direct search)</option>
              </select>
            </div>
          </div>

          {/* Privacy and Availability Toggles */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Search & Availability Preferences
            </h3>

            {/* Availability status */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition bg-slate-50/50">
              <input
                type="checkbox"
                name="availabilityStatus"
                checked={formData.availabilityStatus}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block text-sm">
                  Active Donor Availability
                </span>
                <span className="text-slate-500">
                  Uncheck this if you are temporarily unwell, recently donated, traveling, or unable to donate.
                </span>
              </div>
            </label>

            {/* Search visibility consent */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition bg-slate-50/50">
              <input
                type="checkbox"
                name="isVisibleInSearch"
                checked={formData.isVisibleInSearch}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block text-sm">
                  Search Visibility Consent
                </span>
                <span className="text-slate-500">
                  Allow your donor card to be indexed and discoverable in the "Find Donors" search directory. If unchecked, your profile will remain private.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-sm font-semibold !py-3 !px-8 shadow-md"
            >
              {loading ? 'Saving Profile...' : 'Save Donor Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
