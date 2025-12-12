const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createReservation,
    getUserReservations,
    getRestaurantReservations,
    updateReservation,
    cancelReservation
} = require('../controllers/reservationController');

// User routes
router.post('/', protect, createReservation);
router.get('/user', protect, getUserReservations);

// Restaurant routes
router.get('/restaurant/:id', protect, getRestaurantReservations);

// Update/Cancel routes
router.put('/:id', protect, updateReservation);
router.delete('/:id', protect, cancelReservation);

module.exports = router;
