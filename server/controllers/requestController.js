const BloodRequest = require('../models/BloodRequest');
const DonorProfile = require('../models/DonorProfile');
const generateRequestId = require('../utils/generateRequestId');

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const {
      patientReference,
      bloodGroup,
      hospitalName,
      city,
      state,
      unitsRequired,
      requiredBy,
      urgency,
      notes,
    } = req.body;

    if (
      !patientReference ||
      !bloodGroup ||
      !hospitalName ||
      !city ||
      !state ||
      !unitsRequired ||
      !requiredBy
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields for the blood request.',
      });
    }

    const requestId = generateRequestId();

    const request = await BloodRequest.create({
      requestId,
      requesterId: req.user._id,
      patientReference: patientReference.trim(),
      bloodGroup: bloodGroup.trim().toUpperCase(),
      hospitalName: hospitalName.trim(),
      city: city.trim(),
      state: state.trim(),
      unitsRequired: Number(unitsRequired),
      requiredBy: new Date(requiredBy),
      urgency: urgency || 'Normal',
      notes: notes ? notes.trim() : '',
      status: 'Pending',
    });

    await request.populate('requesterId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully!',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests created by logged in user
// @route   GET /api/requests/my
// @access  Private
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requesterId: req.user._id })
      .populate('requesterId', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get open/available requests for donors
// @route   GET /api/requests/available
// @access  Private (or authenticated donor)
const getAvailableRequests = async (req, res, next) => {
  try {
    // If the user has a donor profile, we can highlight matching requests,
    // but still allow browsing all Pending requests
    const donorProfile = await DonorProfile.findOne({ userId: req.user._id });

    const { bloodGroup, city, urgency } = req.query;

    const filter = {
      status: 'Pending',
      requesterId: { $ne: req.user._id }, // Don't show requester their own request as open to donate
    };

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup.trim().toUpperCase();
    } else if (donorProfile && req.query.matchMyProfile === 'true') {
      filter.bloodGroup = donorProfile.bloodGroup;
    }

    if (city) {
      filter.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    if (urgency) {
      filter.urgency = urgency;
    }

    const requests = await BloodRequest.find(filter)
      .populate('requesterId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: requests.length,
      donorProfile: donorProfile || null,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request by ID or requestId
// @route   GET /api/requests/:id
// @access  Public (or Private)
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let request;

    // Check if query is MongoDB ObjectId or human requestId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      request = await BloodRequest.findById(id)
        .populate('requesterId', 'name email')
        .populate('acceptedBy', 'name email');
    } else {
      request = await BloodRequest.findOne({ requestId: id })
        .populate('requesterId', 'name email')
        .populate('acceptedBy', 'name email');
    }

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    // Also populate donor profile for acceptedBy if present
    let donorInfo = null;
    if (request.acceptedBy) {
      donorInfo = await DonorProfile.findOne({ userId: request.acceptedBy._id });
    }

    res.status(200).json({
      success: true,
      request,
      donorInfo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to request (Accept or Decline)
// @route   PATCH /api/requests/:id/respond
// @access  Private
const respondToRequest = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'decline'
    const { id } = req.params;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'accept' or 'decline'.",
      });
    }

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    // Requester cannot accept their own request
    if (request.requesterId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot accept or decline your own blood request.',
      });
    }

    if (action === 'accept') {
      if (request.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot accept this request. Current status is ${request.status}.`,
        });
      }

      request.status = 'Accepted';
      request.acceptedBy = req.user._id;
      await request.save();

      await request.populate('requesterId', 'name email');
      await request.populate('acceptedBy', 'name email');

      return res.status(200).json({
        success: true,
        message: 'You have accepted this blood request! Thank you for saving lives.',
        request,
      });
    }

    if (action === 'decline') {
      // If the current donor was the one who accepted, releasing/declining sets it back to Pending
      if (request.acceptedBy && request.acceptedBy.toString() === req.user._id.toString()) {
        request.status = 'Pending';
        request.acceptedBy = null;
        await request.save();

        await request.populate('requesterId', 'name email');

        return res.status(200).json({
          success: true,
          message: 'You have withdrawn your acceptance. The request is now open for other donors.',
          request,
        });
      } else {
        // If not accepted yet, donor can decline from their view (status recorded as declined or acknowledged)
        return res.status(200).json({
          success: true,
          message: 'Request declined.',
          request,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a pending request
// @route   PATCH /api/requests/:id/cancel
// @access  Private (Requester only)
const cancelRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    // Only the creator can cancel
    if (request.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this request.',
      });
    }

    // Can only cancel if Pending or Accepted
    if (request.status === 'Cancelled' || request.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${request.status}.`,
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request has been successfully cancelled.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark request as completed
// @route   PATCH /api/requests/:id/complete
// @access  Private (Requester or Accepted Donor)
const completeRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    const isRequester = request.requesterId.toString() === req.user._id.toString();
    const isAcceptedDonor = request.acceptedBy && request.acceptedBy.toString() === req.user._id.toString();

    if (!isRequester && !isAcceptedDonor) {
      return res.status(403).json({
        success: false,
        message: 'Only the request creator or accepted donor can mark this request as completed.',
      });
    }

    if (request.status !== 'Accepted') {
      return res.status(400).json({
        success: false,
        message: `Only Accepted requests can be marked as Completed. Current status: ${request.status}.`,
      });
    }

    request.status = 'Completed';
    await request.save();

    // If accepted donor is known, we can also update their lastDonationDate!
    if (request.acceptedBy) {
      await DonorProfile.findOneAndUpdate(
        { userId: request.acceptedBy },
        { lastDonationDate: new Date() }
      );
    }

    await request.populate('requesterId', 'name email');
    await request.populate('acceptedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blood request marked as Completed! Thank you for facilitating this donation.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAvailableRequests,
  getRequestById,
  respondToRequest,
  cancelRequest,
  completeRequest,
};
