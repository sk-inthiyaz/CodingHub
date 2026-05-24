const mongoose = require('mongoose');

const codeExplanationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  language: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeExplanation', codeExplanationSchema);
