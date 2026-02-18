const express = require('express');
const router = express.Router();
const { getAggregatedCountryData, searchCountries, getFeaturedNews } = require('../controllers/countryController');

router.get('/search', searchCountries);
router.get('/featured-news', getFeaturedNews);
router.get('/:code', getAggregatedCountryData);

module.exports = router;
