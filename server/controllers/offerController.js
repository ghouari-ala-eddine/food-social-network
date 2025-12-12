const Offer = require('../models/Offer');
const User = require('../models/User');

// @desc    Create offer
// @route   POST /api/offers
// @access  Private (Restaurant only)
exports.createOffer = async (req, res) => {
    try {
        const { title, description, discount, validUntil, image } = req.body;

        // Verify user is a restaurant
        const restaurant = await User.findById(req.user.id);
        if (restaurant.accountType !== 'restaurant') {
            return res.status(403).json({ error: 'Only restaurants can create offers' });
        }

        const offer = await Offer.create({
            restaurantId: req.user.id,
            title,
            description,
            discount,
            validUntil,
            image
        });

        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
exports.getActiveOffers = async (req, res) => {
    try {
        const offers = await Offer.getActive();

        // Populate restaurant data
        const populatedOffers = await Promise.all(
            offers.map(async (offer) => {
                const restaurant = await User.findById(offer.restaurantId);
                return {
                    ...offer,
                    restaurant: restaurant ? {
                        id: restaurant.id,
                        restaurantName: restaurant.restaurantName,
                        profilePicture: restaurant.profilePicture,
                        cuisine: restaurant.cuisine
                    } : null
                };
            })
        );

        res.json(populatedOffers.filter(o => o.restaurant !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get restaurant offers
// @route   GET /api/offers/restaurant/:id
// @access  Public
exports.getRestaurantOffers = async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.id);
        const offers = await Offer.findByRestaurant(restaurantId);
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private (Restaurant only)
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(parseInt(req.params.id));

        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        if (offer.restaurantId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Offer.delete(parseInt(req.params.id));
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
