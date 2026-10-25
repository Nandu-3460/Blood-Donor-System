import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../services/api';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hospital,
  MapPin,
  Calendar,
  Eye,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { formatDate } from '../utils/formatDate';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Cancel modal state
  const [cancellingId, setCancellingId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await requestAPI.getMyRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      setError(err.message || 'Failed to load your requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleOpenCancelModal = (id) => {
    setCancellingId(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    try {
      setActionLoading(true);
      await requestAPI.cancel(cancellingId);
      setIsCancelModalOpen(false);
      setCancellingId(null);
      setSuccessMsg('Blood request cancelled successfully.');
      await fetchMyRequests();
    } catch (err) {
      setError(err.message || 'Failed to cancel blood request.');
      setIsCancelModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'ALL') return true;
    return req.status?.toUpperCase() === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Blood Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage all blood requests created under your account.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMyRequests}
            title="Refresh list"
            className="btn-secondary !p-2 text-slate-600"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link to="/create-request" className="btn-primary text-sm !py-2 !px-4">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            New Request
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {successMsg && (
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
        {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map((tab) => {
          const count =
            tab === 'ALL'
              ? requests.length
              : requests.filter((r) => r.status?.toUpperCase() === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blood-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab ? 'bg-blood-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Fetching requests from MongoDB...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <div className="card p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === 'ALL' ? 'No blood requests found' : `No ${activeTab.toLowerCase()} requests`}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {activeTab === 'ALL'
              ? "You haven't submitted any blood requests yet. Start by posting a requirement."
              : `None of your requests currently match the "${activeTab}" status.`}
          </p>
          <Link to="/create-request" className="btn-primary text-xs inline-flex">
            Submit New Blood Request
          </Link>
        </div>
      )}

      {/* Requests list */}
      {!loading && filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="card p-6 border-slate-200 hover:border-blood-300 flex flex-col justify-between"
            >
              <div>
                {/* Top bar: ID, blood group, urgency, status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blood-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blood-600/30">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-blood-700 bg-blood-50 px-2 py-0.5 rounded">
                        {req.requestId}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1">
                        Patient: {req.patientReference}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={req.status} />
                    <UrgencyBadge urgency={req.urgency} />
                  </div>
                </div>

                {/* Details breakdown */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{req.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{req.city}, {req.state}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Needed By:
                    </span>
                    <span className="font-bold text-slate-800">{formatDate(req.requiredBy)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Units Required:</span>
                    <span className="font-bold text-blood-700">{req.unitsRequired} Units</span>
                  </div>

                  {req.acceptedBy && (
                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                      <span className="font-semibold text-emerald-800">
                        Accepted by: {req.acceptedBy.name}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Ready to donate</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-2 flex items-center justify-between gap-3">
                <Link
                  to={`/requests/${req.requestId || req._id}`}
                  className="btn-secondary text-xs flex items-center gap-1.5 !py-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Full Details
                </Link>

                {req.status === 'Pending' && (
                  <button
                    onClick={() => handleOpenCancelModal(req._id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for cancelling request */}
      <Modal
        isOpen={isCancelModalOpen}
        title="Cancel Blood Request?"
        message="Are you sure you want to cancel this pending blood request? Donors will no longer see it as an open emergency."
        confirmText="Yes, Cancel Request"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
}
