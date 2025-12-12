const Reservation = require('../models/Reservation');
const User = require('../models/User');

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
    try {
        const { restaurantId, date, time, partySize, specialRequests } = req.body;

        // Validate restaurant exists
        const restaurant = await User.findById(parseInt(restaurantId));
        if (!restaurant || restaurant.accountType !== 'restaurant') {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Validate date is in the future
        const reservationDate = new Date(date);
        if (reservationDate < new Date()) {
            return res.status(400).json({ error: 'Reservation date must be in the future' });
        }

        const reservation = await Reservation.create({
            userId: req.user.id,
            restaurantId: parseInt(restaurantId),
            date,
            time,
            partySize: parseInt(partySize),
            specialRequests
        });

        // Create notification for restaurant owner
        const Notification = require('../models/Notification');
        const customer = await User.findById(req.user.id);

        await Notification.create({
            userId: parseInt(restaurantId),
            type: 'reservation',
            fromUserId: req.user.id,
            message: `${customer?.username || 'Someone'} made a reservation for ${partySize} on ${date} at ${time}`,
            link: '/restaurant-dashboard'
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/user
// @access  Private
exports.getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findByUser(req.user.id);

        // Populate restaurant data
        const populatedReservations = await Promise.all(
            reservations.map(async (reservation) => {
                const restaurant = await User.findById(reservation.restaurantId);
                return {
                    ...reservation,
                    restaurant: restaurant ? {
                        id: restaurant.id,
                        restaurantName: restaurant.restaurantName,
                        address: restaurant.address,
                        phone: restaurant.phone
                    } : null
                };
            })
        );

        res.json(populatedReservations.filter(r => r.restaurant !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get restaurant's reservations
// @route   GET /api/reservations/restaurant/:id
// @access  Private (Restaurant owner only)
exports.getRestaurantReservations = async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.id);
        console.log(`Fetching reservations for restaurant ID: ${restaurantId}`);
        console.log(`User ID requesting: ${req.user.id}`);

        // Check if user owns this restaurant
        if (req.user.id !== restaurantId) {
            console.log('Authorization failed');
            return res.status(403).json({ error: 'Not authorized' });
        }

        const reservations = await Reservation.findByRestaurant(restaurantId);
        console.log(`Found ${reservations.length} reservations`);

        // Populate user data
        const populatedReservations = await Promise.all(
            reservations.map(async (reservation) => {
                const user = await User.findById(reservation.userId);
                console.log(`Populating reservation ${reservation.id}, User found: ${!!user}`);
                return {
                    ...reservation,
                    user: user ? {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone
                    } : null
                };
            })
        );

        const finalReservations = populatedReservations.filter(r => r.user !== null);
        console.log(`Returning ${finalReservations.length} populated reservations`);
        res.json(finalReservations);
    } catch (error) {
        console.error('Error in getRestaurantReservations:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(parseInt(req.params.id));

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check authorization (user or restaurant owner)
        if (req.user.id !== reservation.userId && req.user.id !== reservation.restaurantId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { status } = req.body;
        const updatedReservation = await Reservation.update(parseInt(req.params.id), { status });

        // Create notification for user when restaurant confirms/cancels
        if (req.user.id === reservation.restaurantId) {
            const Notification = require('../models/Notification');
            const restaurant = await User.findById(reservation.restaurantId);

            let message = '';
            if (status === 'confirmed') {
                message = `${restaurant?.restaurantName || 'Restaurant'} confirmed your reservation for ${reservation.date} at ${reservation.time}`;
            } else if (status === 'cancelled') {
                message = `${restaurant?.restaurantName || 'Restaurant'} cancelled your reservation for ${reservation.date} at ${reservation.time}`;
            }

            if (message) {
                await Notification.create({
                    userId: reservation.userId,
                    type: status === 'confirmed' ? 'reservation_confirmed' : 'reservation_cancelled',
                    fromUserId: reservation.restaurantId,
                    message,
                    link: '/reservations'
                });
            }
        }

        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(parseInt(req.params.id));

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check authorization (user or restaurant owner)
        if (req.user.id !== reservation.userId && req.user.id !== reservation.restaurantId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Reservation.update(parseInt(req.params.id), { status: 'cancelled' });

        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
