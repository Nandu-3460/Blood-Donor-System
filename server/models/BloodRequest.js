const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientReference: {
      type: String,
      required: [true, 'Patient name or reference is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
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
    unitsRequired: {
      type: Number,
      required: [true, 'Number of units required is mandatory'],
      min: [1, 'Must request at least 1 unit'],
      max: [50, 'Cannot request more than 50 units at once'],
    },
    requiredBy: {
      type: Date,
      required: [true, 'Required-by date is mandatory'],
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Emergency'],
      default: 'Normal',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bloodRequestSchema.index({ requesterId: 1, createdAt: -1 });
bloodRequestSchema.index({ bloodGroup: 1, city: 1, status: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
