const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user profile (public)
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return public user data (no password)
        // Return public user data (no password)
        const responseData = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followers: user.followers.length,
            following: user.following.length,
            createdAt: user.createdAt,
            accountType: user.accountType
        };

        // Add restaurant-specific fields if applicable
        if (user.accountType === 'restaurant') {
            Object.assign(responseData, {
                restaurantName: user.restaurantName,
                description: user.description,
                address: user.address,
                phone: user.phone,
                location: user.location,
                openingHours: user.openingHours,
                cuisine: user.cuisine,
                averageRating: user.averageRating,
                totalRatings: user.totalRatings
            });
        }

        console.log('Sending user profile response for user', userId, ':', responseData);
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get user's recipes
// @route   GET /api/users/:id/recipes
// @access  Public
exports.getUserRecipes = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const recipes = await Recipe.findByAuthor(userId);

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all users (for search/discovery)
// @route   GET /api/users
// @access  Public
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();

        // Return public data only
        const publicUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followers: user.followers.length,
            following: user.following.length
        }));

        res.json(publicUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
