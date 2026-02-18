const SavedCountry = require('../models/SavedCountry');

exports.saveCountry = async (req, res) => {
  try {
    const { countryCode, countryName, userId = 'anonymous' } = req.body;
    if (!countryCode || !countryName) {
      return res.status(400).json({ error: 'countryCode and countryName are required' });
    }
    const existing = await SavedCountry.findOne({ userId, countryCode });
    if (existing) return res.json({ success: true, saved: existing, alreadySaved: true });
    const saved = await SavedCountry.create({ userId, countryCode, countryName });
    res.status(201).json({ success: true, saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save country' });
  }
};

exports.getSavedCountries = async (req, res) => {
  try {
    const { userId = 'anonymous' } = req.query;
    const saved = await SavedCountry.find({ userId }).sort({ savedAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved countries' });
  }
};

exports.removeSavedCountry = async (req, res) => {
  try {
    const { code } = req.params;
    const { userId = 'anonymous' } = req.query;
    await SavedCountry.deleteOne({ userId, countryCode: code });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove country' });
  }
};
