const BloodRequest = require('../models/BloodRequest');
const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');

// @desc    Get dashboard metrics and summaries for logged-in user
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user's donor profile if any
    const donorProfile = await DonorProfile.findOne({ userId }).populate('userId', 'name email');

    // Counts for requests created by the user
    const [
      totalCreated,
      pendingCount,
      acceptedCount,
      completedCount,
      recentRequests,
      acceptedByMeCount,
      acceptedByMeRequests,
    ] = await Promise.all([
      BloodRequest.countDocuments({ requesterId: userId }),
      BloodRequest.countDocuments({ requesterId: userId, status: 'Pending' }),
      BloodRequest.countDocuments({ requesterId: userId, status: 'Accepted' }),
      BloodRequest.countDocuments({ requesterId: userId, status: 'Completed' }),
      BloodRequest.find({ requesterId: userId })
        .populate('acceptedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      BloodRequest.countDocuments({ acceptedBy: userId, status: 'Accepted' }),
      BloodRequest.find({ acceptedBy: userId, status: 'Accepted' })
        .populate('requesterId', 'name email')
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    // Matching open requests count for donors
    let matchingOpenRequestsCount = 0;
    if (donorProfile) {
      matchingOpenRequestsCount = await BloodRequest.countDocuments({
        status: 'Pending',
        bloodGroup: donorProfile.bloodGroup,
        requesterId: { $ne: userId },
      });
    }

    // Community-wide impact stats
    const [totalDonorsRegistered, totalCompletedCommunityDonations] = await Promise.all([
      DonorProfile.countDocuments({ isVisibleInSearch: true }),
      BloodRequest.countDocuments({ status: 'Completed' }),
    ]);

    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
      donorProfile: donorProfile || null,
      stats: {
        totalCreated,
        pending: pendingCount,
        accepted: acceptedCount,
        completed: completedCount,
        acceptedByMe: acceptedByMeCount,
        matchingOpenRequests: matchingOpenRequestsCount,
        community: {
          totalDonors: totalDonorsRegistered,
          totalDonationsFulfilled: totalCompletedCommunityDonations,
        },
      },
      recentRequests,
      acceptedByMeRequests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
