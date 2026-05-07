const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String, // Or reference to User schema if you want
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
