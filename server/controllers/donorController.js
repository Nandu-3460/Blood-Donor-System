const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');

// Helper to format donor output based on privacy consent and caller's authentication state
const formatDonorOutput = (donorDoc, isAuthenticated = false, currentUserId = null) => {
  const isOwner = currentUserId && donorDoc.userId?._id?.toString() === currentUserId.toString();
  
  let contactNumber = donorDoc.phone;
  let canViewPhone = false;

  if (isOwner) {
    canViewPhone = true;
  } else if (donorDoc.contactVisibility === 'Always') {
    canViewPhone = true;
  } else if (donorDoc.contactVisibility === 'RegisteredOnly') {
    canViewPhone = Boolean(isAuthenticated);
  } else if (donorDoc.contactVisibility === 'OnRequest') {
    canViewPhone = false;
  }

  return {
    _id: donorDoc._id,
    userId: donorDoc.userId?._id,
    name: donorDoc.userId?.name || 'Anonymous Donor',
    email: isOwner || donorDoc.contactVisibility === 'Always' ? donorDoc.userId?.email : undefined,
    bloodGroup: donorDoc.bloodGroup,
    city: donorDoc.city,
    state: donorDoc.state,
    phone: canViewPhone ? contactNumber : null,
    phoneHiddenReason: !canViewPhone
      ? donorDoc.contactVisibility === 'RegisteredOnly' && !isAuthenticated
        ? 'Login to view contact number'
        : 'Contact accessible via Blood Request'
      : null,
    availabilityStatus: donorDoc.availabilityStatus,
    lastDonationDate: donorDoc.lastDonationDate,
    isVisibleInSearch: donorDoc.isVisibleInSearch,
    contactVisibility: donorDoc.contactVisibility,
    createdAt: donorDoc.createdAt,
    updatedAt: donorDoc.updatedAt,
  };
};

// @desc    Create or update donor profile for logged-in user
// @route   POST /api/donors/profile
// @access  Private
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      city,
      state,
      phone,
      availabilityStatus,
      lastDonationDate,
      isVisibleInSearch,
      contactVisibility,
    } = req.body;

    if (!bloodGroup || !city || !state || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Blood group, city, state, and phone number are required.',
      });
    }

    let profile = await DonorProfile.findOne({ userId: req.user._id });

    if (profile) {
      // Update existing
      profile.bloodGroup = bloodGroup;
      profile.city = city.trim();
      profile.state = state.trim();
      profile.phone = phone.trim();
      if (typeof availabilityStatus === 'boolean') profile.availabilityStatus = availabilityStatus;
      if (lastDonationDate !== undefined) profile.lastDonationDate = lastDonationDate ? new Date(lastDonationDate) : null;
      if (typeof isVisibleInSearch === 'boolean') profile.isVisibleInSearch = isVisibleInSearch;
      if (contactVisibility) profile.contactVisibility = contactVisibility;

      await profile.save();
      await profile.populate('userId', 'name email');

      return res.status(200).json({
        success: true,
        message: 'Donor profile updated successfully!',
        donor: formatDonorOutput(profile, true, req.user._id),
      });
    }

    // Create new profile
    profile = await DonorProfile.create({
      userId: req.user._id,
      bloodGroup,
      city: city.trim(),
      state: state.trim(),
      phone: phone.trim(),
      availabilityStatus: typeof availabilityStatus === 'boolean' ? availabilityStatus : true,
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
      isVisibleInSearch: typeof isVisibleInSearch === 'boolean' ? isVisibleInSearch : true,
      contactVisibility: contactVisibility || 'RegisteredOnly',
    });

    await profile.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Donor profile created successfully!',
      donor: formatDonorOutput(profile, true, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donor profile (PUT alias for update)
// @route   PUT /api/donors/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  return createOrUpdateProfile(req, res, next);
};

// @desc    Quick toggle availability status
// @route   PATCH /api/donors/availability
// @access  Private
const toggleAvailability = async (req, res, next) => {
  try {
    const profile = await DonorProfile.findOne({ userId: req.user._id }).populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No donor profile found for this account. Please create one first.',
      });
    }

    const newStatus = typeof req.body.availabilityStatus === 'boolean'
      ? req.body.availabilityStatus
      : !profile.availabilityStatus;

    profile.availabilityStatus = newStatus;
    await profile.save();

    res.status(200).json({
      success: true,
      message: `Availability status updated to ${newStatus ? 'Available' : 'Unavailable'}.`,
      availabilityStatus: profile.availabilityStatus,
      donor: formatDonorOutput(profile, true, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search donors by blood group and location
// @route   GET /api/donors
// @access  Public (Optional auth for contact details)
const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, state } = req.query;

    const query = {
      isVisibleInSearch: true,
      availabilityStatus: true,
    };

    if (bloodGroup && bloodGroup.trim() !== '') {
      query.bloodGroup = bloodGroup.trim().toUpperCase();
    }

    if (city && city.trim() !== '') {
      // Case-insensitive regex match for city
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    if (state && state.trim() !== '') {
      query.state = { $regex: new RegExp(`^${state.trim()}$`, 'i') };
    }

    const donors = await DonorProfile.find(query)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(50);

    const isAuthenticated = Boolean(req.user);
    const currentUserId = req.user?._id;

    const formattedDonors = donors.map((d) =>
      formatDonorOutput(d, isAuthenticated, currentUserId)
    );

    res.status(200).json({
      success: true,
      count: formattedDonors.length,
      donors: formattedDonors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donor by ID
// @route   GET /api/donors/:id
// @access  Public (Optional auth)
const getDonorById = async (req, res, next) => {
  try {
    const donor = await DonorProfile.findById(req.params.id).populate('userId', 'name email');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found.',
      });
    }

    // If profile is hidden and current user is not the owner, don't show
    const isOwner = req.user && donor.userId?._id?.toString() === req.user._id.toString();
    if (!donor.isVisibleInSearch && !isOwner) {
      return res.status(404).json({
        success: false,
        message: 'This donor profile is currently private.',
      });
    }

    const isAuthenticated = Boolean(req.user);
    const currentUserId = req.user?._id;

    res.status(200).json({
      success: true,
      donor: formatDonorOutput(donor, isAuthenticated, currentUserId),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateProfile,
  updateProfile,
  toggleAvailability,
  searchDonors,
  getDonorById,
};
