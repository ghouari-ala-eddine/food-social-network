const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected routes
router.post('/', protect, recipeController.createRecipe);
router.put('/:id', protect, recipeController.updateRecipe);
router.delete('/:id', protect, recipeController.deleteRecipe);
router.post('/:id/like', protect, recipeController.toggleLike);

module.exports = router;
