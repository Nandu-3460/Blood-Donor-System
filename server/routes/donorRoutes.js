const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  updateProfile,
  toggleAvailability,
  searchDonors,
  getDonorById,
} = require('../controllers/donorController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for privacy-sensitive contact numbers)
router.get('/', optionalAuth, searchDonors);
router.get('/:id', optionalAuth, getDonorById);

// Protected routes for donor profile management
router.post('/profile', protect, createOrUpdateProfile);
router.put('/profile', protect, updateProfile);
router.patch('/availability', protect, toggleAvailability);

module.exports = router;
