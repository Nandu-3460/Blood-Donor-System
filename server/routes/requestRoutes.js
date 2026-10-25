const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getAvailableRequests,
  getRequestById,
  respondToRequest,
  cancelRequest,
  completeRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

// Protected blood request routes
router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/available', protect, getAvailableRequests);
router.get('/:id', getRequestById); // Can be viewed publicly or privately
router.patch('/:id/respond', protect, respondToRequest);
router.patch('/:id/cancel', protect, cancelRequest);
router.patch('/:id/complete', protect, completeRequest);

module.exports = router;
