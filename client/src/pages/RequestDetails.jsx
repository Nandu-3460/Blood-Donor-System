import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  Hospital,
  MapPin,
  Calendar,
  Clock,
  User,
  Heart,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { formatDate, formatDateTime, getDaysRemaining } from '../utils/formatDate';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [request, setRequest] = useState(null);
  const [donorInfo, setDonorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Modal dialog states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    actionType: '', // 'accept', 'decline', 'cancel', 'complete'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await requestAPI.getById(id);
      setRequest(res.data.request);
      setDonorInfo(res.data.donorInfo);
    } catch (err) {
      setError(err.message || 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleOpenActionModal = (actionType) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/requests/${id}` } } });
      return;
    }

    let title = '';
    let message = '';
    let confirmText = 'Confirm';

    switch (actionType) {
      case 'accept':
        title = 'Accept & Pledge Blood Donation?';
        message = `Are you sure you want to accept this request for ${request.unitsRequired} unit(s) of ${request.bloodGroup} at ${request.hospitalName}? The requester will be notified of your commitment.`;
        confirmText = 'Yes, I Pledge To Donate';
        break;
      case 'decline':
        title = 'Withdraw Your Acceptance?';
        message = 'Are you sure you want to release your commitment? The request will return to Pending so other donors can step in.';
        confirmText = 'Yes, Withdraw Acceptance';
        break;
      case 'cancel':
        title = 'Cancel Blood Request?';
        message = 'Are you sure you want to cancel this request? It will be marked as Cancelled and no longer accept donors.';
        confirmText = 'Yes, Cancel Request';
        break;
      case 'complete':
        title = 'Confirm Donation Completed?';
        message = 'Confirm that the blood donation has been successfully fulfilled and verified at the hospital.';
        confirmText = 'Yes, Mark as Completed';
        break;
      default:
        break;
    }

    setModalConfig({
      isOpen: true,
      title,
      message,
      confirmText,
      actionType,
    });
  };

  const handleConfirmAction = async () => {
    try {
      setActionLoading(true);
      const actionType = modalConfig.actionType;

      if (actionType === 'accept' || actionType === 'decline') {
        const res = await requestAPI.respond(request._id, actionType);
        setActionMessage(res.data.message);
      } else if (actionType === 'cancel') {
        const res = await requestAPI.cancel(request._id);
        setActionMessage(res.data.message);
      } else if (actionType === 'complete') {
        const res = await requestAPI.complete(request._id);
        setActionMessage(res.data.message);
      }

      setModalConfig((prev) => ({ ...prev, isOpen: false }));
      await fetchRequest();
    } catch (err) {
      setError(err.message || 'Operation failed.');
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading request information...</p>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Request Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <Link to="/find-donors" className="btn-primary text-sm inline-flex">
          Explore Available Donors
        </Link>
      </div>
    );
  }

  const isRequester =
    user && request.requesterId && (user._id === request.requesterId._id || user._id === request.requesterId);
  const isAcceptedDonor =
    user && request.acceptedBy && (user._id === request.acceptedBy._id || user._id === request.acceptedBy);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>

        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
          ID: {request.requestId}
        </span>
      </div>

      {actionMessage && (
        <Alert
          type="success"
          message={actionMessage}
          onClose={() => setActionMessage('')}
        />
      )}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Main card */}
      <div className="card overflow-hidden mb-8 border-slate-200 shadow-sm">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blood-800 via-blood-700 to-blood-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-blood-700 flex items-center justify-center font-black text-2xl shadow-xl flex-shrink-0">
                {request.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-blood-950/50 text-blood-200 px-2.5 py-0.5 rounded-full">
                    {request.unitsRequired} Unit(s) Required
                  </span>
                  <UrgencyBadge urgency={request.urgency} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Patient Reference: {request.patientReference}
                </h1>
                <p className="text-xs text-blood-200 mt-1 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Requested on {formatDate(request.createdAt)} • Deadline: {formatDate(request.requiredBy)} ({getDaysRemaining(request.requiredBy)})
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
              <span className="text-xs text-blood-200 uppercase font-semibold">Current Status</span>
              <StatusBadge status={request.status} />
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hospital & Location Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Hospital & Delivery Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Hospital className="w-5 h-5 text-blood-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Hospital Name</span>
                    <span className="font-bold text-slate-800">{request.hospitalName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blood-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">City & State</span>
                    <span className="font-semibold text-slate-800">
                      {request.city}, {request.state}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blood-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Required By Date</span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(request.requiredBy)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requester & Notes */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Requester & Notes
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Posted By</span>
                    <span className="font-semibold text-slate-800">
                      {request.requesterId?.name || 'Verified Seeker'}
                    </span>
                    {request.requesterId?.email && (
                      <span className="text-xs text-slate-500 block">
                        {request.requesterId.email}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium mb-1">
                    Clinical Notes / Directions
                  </span>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                    {request.notes || 'No additional instructions provided by requester.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accepted Donor Section (if Accepted) */}
          {request.status === 'Accepted' && request.acceptedBy && (
            <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Accepted Blood Donor
                    </span>
                    <h4 className="text-base font-bold text-emerald-950">
                      {request.acceptedBy.name}
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Committed to donate for this patient requirement.
                    </p>
                  </div>
                </div>

                {donorInfo?.phone && (
                  <a
                    href={`tel:${donorInfo.phone}`}
                    className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 text-xs flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call: {donorInfo.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Workflow Buttons */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              System verification status: <strong>Recorded in MongoDB Atlas</strong>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Requester Actions */}
              {isRequester && request.status === 'Pending' && (
                <button
                  onClick={() => handleOpenActionModal('cancel')}
                  className="btn-secondary text-xs !text-red-600 hover:!bg-red-50"
                >
                  Cancel Blood Request
                </button>
              )}

              {/* Creator or Accepted Donor can complete when Accepted */}
              {(isRequester || isAcceptedDonor) && request.status === 'Accepted' && (
                <button
                  onClick={() => handleOpenActionModal('complete')}
                  className="btn-primary !bg-blue-600 hover:!bg-blue-700 text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Donation Fulfilled & Completed
                </button>
              )}

              {/* Donor Actions (Accept / Decline) */}
              {!isRequester && request.status === 'Pending' && (
                <button
                  onClick={() => handleOpenActionModal('accept')}
                  className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Accept & Pledge To Donate
                </button>
              )}

              {isAcceptedDonor && request.status === 'Accepted' && (
                <button
                  onClick={() => handleOpenActionModal('decline')}
                  className="btn-secondary text-xs !text-red-600 hover:!bg-red-50"
                >
                  Withdraw Acceptance (Set Back to Pending)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmVariant={modalConfig.actionType === 'cancel' || modalConfig.actionType === 'decline' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
