const User = require('../models/User');

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in kilometers
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// @desc    Get nearby restaurants
// @route   GET /api/location/nearby?lat=<lat>&lng=<lng>&radius=<radius>
// @access  Public
exports.getNearbyRestaurants = async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query; // Default radius: 10km

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const searchRadius = parseFloat(radius);

        // Get all restaurants
        const allUsers = await User.getAll();
        const restaurants = allUsers.filter(user => user.accountType === 'restaurant');

        // Filter restaurants by distance
        const nearbyRestaurants = restaurants
            .map(restaurant => {
                if (!restaurant.location || !restaurant.location.lat || !restaurant.location.lng) {
                    return null;
                }

                const distance = calculateDistance(
                    userLat,
                    userLng,
                    restaurant.location.lat,
                    restaurant.location.lng
                );

                if (distance <= searchRadius) {
                    return {
                        id: restaurant.id,
                        restaurantName: restaurant.restaurantName,
                        username: restaurant.username,
                        description: restaurant.description,
                        address: restaurant.address,
                        phone: restaurant.phone,
                        cuisine: restaurant.cuisine,
                        averageRating: restaurant.averageRating,
                        totalRatings: restaurant.totalRatings,
                        location: restaurant.location,
                        distance: Math.round(distance * 10) / 10 // Round to 1 decimal
                    };
                }
                return null;
            })
            .filter(r => r !== null)
            .sort((a, b) => a.distance - b.distance); // Sort by distance

        res.json(nearbyRestaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
