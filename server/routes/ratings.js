const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, ratingController.createRating);
router.get('/restaurant/:id', ratingController.getRestaurantRatings);
router.get('/restaurant/:id/average', ratingController.getAverageRating);
router.delete('/:id', protect, ratingController.deleteRating);

module.exports = router;
