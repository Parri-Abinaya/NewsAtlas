const { Router } = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const User = require('../models/User');

const router = Router();

router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const existing = await User.findOne({ firebaseUid: req.user.uid });
    if (existing) return res.json(existing);
    const user = await User.create({ firebaseUid: req.user.uid, name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;