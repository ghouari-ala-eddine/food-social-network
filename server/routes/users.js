const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const followController = require('../controllers/followController');
const { protect } = require('../middleware/auth');

// User profile routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserProfile);
router.get('/:id/recipes', userController.getUserRecipes);

// Follow routes (protected)
router.post('/:id/follow', protect, followController.followUser);
router.delete('/:id/unfollow', protect, followController.unfollowUser);
router.get('/:id/followers', followController.getFollowers);
router.get('/:id/following', followController.getFollowing);

module.exports = router;
