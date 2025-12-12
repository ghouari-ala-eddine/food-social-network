const Rating = require('../models/Rating');
const User = require('../models/User');

// @desc    Create rating
// @route   POST /api/ratings
// @access  Private
exports.createRating = async (req, res) => {
    try {
        const { restaurantId, rating, review } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const restaurant = await User.findById(parseInt(restaurantId));
        if (!restaurant || restaurant.accountType !== 'restaurant') {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const newRating = await Rating.create({
            restaurantId: parseInt(restaurantId),
            userId: req.user.id,
            rating,
            review
        });

        // Update restaurant average rating and total count
        const avgRating = await Rating.getAverageRating(parseInt(restaurantId));
        const allRatings = await Rating.findByRestaurant(parseInt(restaurantId));

        console.log('Updating restaurant:', parseInt(restaurantId));
        console.log('New average rating:', avgRating);
        console.log('Total ratings:', allRatings.length);

        const updatedUser = await User.update(parseInt(restaurantId), {
            averageRating: avgRating,
            totalRatings: allRatings.length
        });

        console.log('Updated user:', updatedUser);

        res.status(201).json(newRating);
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get restaurant ratings
// @route   GET /api/ratings/restaurant/:id
// @access  Public
exports.getRestaurantRatings = async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.id);
        const ratings = await Rating.findByRestaurant(restaurantId);

        // Populate user data
        const populatedRatings = await Promise.all(
            ratings.map(async (rating) => {
                const user = await User.findById(rating.userId);
                return {
                    ...rating,
                    user: user ? {
                        id: user.id,
                        username: user.username,
                        profilePicture: user.profilePicture
                    } : null
                };
            })
        );

        res.json(populatedRatings.filter(r => r.user !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get average rating
// @route   GET /api/ratings/restaurant/:id/average
// @access  Public
exports.getAverageRating = async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.id);
        const average = await Rating.getAverageRating(restaurantId);
        const ratings = await Rating.findByRestaurant(restaurantId);

        res.json({
            average: average.toFixed(1),
            total: ratings.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private
exports.deleteRating = async (req, res) => {
    try {
        const rating = await Rating.findById(parseInt(req.params.id));

        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        if (rating.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const restaurantId = rating.restaurantId;
        await Rating.delete(parseInt(req.params.id));

        // Update restaurant average rating and total count
        const avgRating = await Rating.getAverageRating(restaurantId);
        const allRatings = await Rating.findByRestaurant(restaurantId);

        await User.update(restaurantId, {
            averageRating: avgRating,
            totalRatings: allRatings.length
        });

        res.json({ message: 'Rating deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
