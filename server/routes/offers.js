const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { protect } = require('../middleware/auth');

router.post('/', protect, offerController.createOffer);
router.get('/', offerController.getActiveOffers);
router.get('/restaurant/:id', offerController.getRestaurantOffers);
router.delete('/:id', protect, offerController.deleteOffer);

module.exports = router;
