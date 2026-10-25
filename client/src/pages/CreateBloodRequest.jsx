import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAPI } from '../services/api';
import {
  Droplet,
  Hospital,
  MapPin,
  Calendar,
  AlertTriangle,
  User,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import Alert from '../components/Alert';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CreateBloodRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientReference: '',
    bloodGroup: '',
    hospitalName: '',
    city: '',
    state: '',
    unitsRequired: 1,
    requiredBy: '',
    urgency: 'Normal',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.patientReference.trim() ||
      !formData.bloodGroup ||
      !formData.hospitalName.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.requiredBy
    ) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.unitsRequired < 1 || formData.unitsRequired > 50) {
      setError('Number of units must be between 1 and 50.');
      return;
    }

    try {
      setLoading(true);
      const res = await requestAPI.create({
        ...formData,
        unitsRequired: Number(formData.unitsRequired),
      });

      const newRequest = res.data.request;
      navigate(`/requests/${newRequest.requestId || newRequest._id}?created=true`);
    } catch (err) {
      setError(err.message || 'Failed to submit blood request.');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date string for min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Blood Request
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Submit an emergency blood requirement. It will be assigned a unique tracking ID and broadcast to matching voluntary donors.
        </p>
      </div>

      <div className="p-4 mb-6 rounded-xl bg-blood-50 border border-blood-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blood-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blood-800 leading-relaxed">
          <strong>Privacy note:</strong> You can use a patient reference (e.g. "Patient #402" or initials) instead of full personal names if preferred for privacy. Hospital medical staff will verify identity during donation.
        </div>
      </div>

      <div className="card p-6 sm:p-8 bg-white border border-slate-200">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient Name / Reference */}
            <div>
              <label className="label">
                Patient Name or Reference <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  name="patientReference"
                  placeholder="e.g. Alex M. or Bed #14 ICU"
                  value={formData.patientReference}
                  onChange={handleChange}
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="label">
                Required Blood Group <span className="text-red-500">*</span>
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

            {/* Hospital Name */}
            <div>
              <label className="label">
                Hospital / Blood Bank Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hospital className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  name="hospitalName"
                  placeholder="e.g. City General Hospital, Ward 3"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Units Required */}
            <div>
              <label className="label">
                Units Required <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="50"
                name="unitsRequired"
                value={formData.unitsRequired}
                onChange={handleChange}
                className="input-field"
              />
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

            {/* Required By Date */}
            <div>
              <label className="label">
                Required By Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  required
                  name="requiredBy"
                  min={todayStr}
                  value={formData.requiredBy}
                  onChange={handleChange}
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="label">Urgency Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['Normal', 'Urgent', 'Emergency'].map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, urgency: urg }))}
                    className={`py-2 rounded-lg text-xs font-bold border transition ${
                      formData.urgency === urg
                        ? urg === 'Emergency'
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : urg === 'Urgent'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="label">Additional Clinical Notes or Contact Directions</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. Contact hospital blood bank directly on arrival, patient undergoing scheduled surgery on Friday morning..."
              value={formData.notes}
              onChange={handleChange}
              className="input-field resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-sm font-semibold !py-2.5 !px-6 shadow-md"
            >
              {loading ? 'Creating Request...' : 'Publish Blood Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
