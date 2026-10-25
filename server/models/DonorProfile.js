const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    isVisibleInSearch: {
      type: Boolean,
      default: true,
    },
    contactVisibility: {
      type: String,
      enum: ['Always', 'RegisteredOnly', 'OnRequest'],
      default: 'RegisteredOnly',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to optimize search queries by blood group and city
donorProfileSchema.index({ bloodGroup: 1, city: 1 });
donorProfileSchema.index({ availabilityStatus: 1, isVisibleInSearch: 1 });

module.exports = mongoose.model('DonorProfile', donorProfileSchema);
