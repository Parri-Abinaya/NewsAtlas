const mongoose = require('mongoose');

const savedCountrySchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedCountry', savedCountrySchema);
