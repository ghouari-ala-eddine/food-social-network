const express = require('express');
const router = express.Router();
const { getNearbyRestaurants } = require('../controllers/locationController');

// Get nearby restaurants
router.get('/nearby', getNearbyRestaurants);

module.exports = router;
