const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res) => {
    try {
        const userToFollowId = parseInt(req.params.id);
        const currentUserId = req.user.id;

        if (userToFollowId === currentUserId) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        const userToFollow = await User.findById(userToFollowId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already following
        if (currentUser.following.includes(userToFollowId)) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        // Add to following list
        currentUser.following.push(userToFollowId);
        // Add to followers list
        userToFollow.followers.push(currentUserId);

        // Create notification
        await Notification.create({
            userId: userToFollowId,
            type: 'follow',
            fromUserId: currentUserId,
            message: `${currentUser.username} started following you`
        });

        res.json({ message: 'Successfully followed user', following: currentUser.following.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/unfollow
// @access  Private
exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollowId = parseInt(req.params.id);
        const currentUserId = req.user.id;

        const userToUnfollow = await User.findById(userToUnfollowId);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if not following
        if (!currentUser.following.includes(userToUnfollowId)) {
            return res.status(400).json({ error: 'Not following this user' });
        }

        // Remove from following list
        currentUser.following = currentUser.following.filter(id => id !== userToUnfollowId);
        // Remove from followers list
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== currentUserId);

        res.json({ message: 'Successfully unfollowed user', following: currentUser.following.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Public
exports.getFollowers = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get follower details
        const followers = await Promise.all(
            user.followers.map(async (followerId) => {
                const follower = await User.findById(followerId);
                return follower ? {
                    id: follower.id,
                    username: follower.username,
                    profilePicture: follower.profilePicture,
                    bio: follower.bio
                } : null;
            })
        );

        res.json(followers.filter(f => f !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get users that user is following
// @route   GET /api/users/:id/following
// @access  Public
exports.getFollowing = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get following details
        const following = await Promise.all(
            user.following.map(async (followingId) => {
                const followedUser = await User.findById(followingId);
                return followedUser ? {
                    id: followedUser.id,
                    username: followedUser.username,
                    profilePicture: followedUser.profilePicture,
                    bio: followedUser.bio
                } : null;
            })
        );

        res.json(following.filter(f => f !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
