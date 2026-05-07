const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  leadSource: {
    type: String,
  },
  assignedSalesperson: {
    type: String,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New',
  },
  estimatedDealValue: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
