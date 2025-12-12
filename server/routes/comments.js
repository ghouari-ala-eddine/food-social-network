const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getRecipeComments,
    addComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

// Get comments for a recipe (public)
router.get('/recipe/:recipeId', getRecipeComments);

// Add comment (protected)
router.post('/', protect, addComment);

// Update comment (protected)
router.put('/:id', protect, updateComment);

// Delete comment (protected)
router.delete('/:id', protect, deleteComment);

module.exports = router;
