require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const countryRoutes = require('./routes/country');
const feedbackRoutes = require('./routes/feedback');
const marketRoutes = require('./routes/markets');
const savedRoutes = require('./routes/saved');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsatlas')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Routes
app.use('/api/country', countryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/saved', savedRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`News Atlas server running on port ${PORT}`));
