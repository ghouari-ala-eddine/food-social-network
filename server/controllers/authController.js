const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, accountType, restaurantName, address, phone, cuisine, location } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            accountType: accountType || 'user',
        });

        // Update restaurant-specific fields if restaurant account
        if (accountType === 'restaurant') {
            user.restaurantName = restaurantName || username;
            user.address = address || '';
            user.phone = phone || '';
            user.cuisine = cuisine || [];
            user.location = location || null;
            user.averageRating = 0;
            user.totalRatings = 0;
        }

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                accountType: user.accountType,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                accountType: user.accountType,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, bio, profilePicture } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        // Update user fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        user.updatedAt = new Date();

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
