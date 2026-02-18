const express = require('express');
const router = express.Router();
const { getMarketOverview } = require('../controllers/marketsController');

router.get('/', getMarketOverview);

module.exports = router;
