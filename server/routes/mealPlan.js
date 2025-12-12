const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.post('/', protect, mealPlanController.addMeal);
router.get('/', protect, mealPlanController.getMealPlan);
router.delete('/:id', protect, mealPlanController.removeMeal);

module.exports = router;
