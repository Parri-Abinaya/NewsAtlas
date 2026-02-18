const express = require('express');
const router = express.Router();
const { saveCountry, getSavedCountries, removeSavedCountry } = require('../controllers/savedController');

router.post('/', saveCountry);
router.get('/', getSavedCountries);
router.delete('/:code', removeSavedCountry);

module.exports = router;
