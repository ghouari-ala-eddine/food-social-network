const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');

// @desc    Add meal to plan
// @route   POST /api/meal-plan
// @access  Private
exports.addMeal = async (req, res) => {
    try {
        const { date, mealType, recipeId } = req.body;

        if (!date || !mealType || !recipeId) {
            return res.status(400).json({ error: 'Please provide date, mealType, and recipeId' });
        }

        // Check if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Remove existing meal for this slot if any
        await MealPlan.deleteByUserDateAndMeal(req.user.id, date, mealType);

        // Create new meal plan entry
        const mealPlan = await MealPlan.create({
            userId: req.user.id,
            date,
            mealType,
            recipeId
        });

        res.status(201).json(mealPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get user's meal plan
// @route   GET /api/meal-plan?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// @access  Private
exports.getMealPlan = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let mealPlans;
        if (startDate && endDate) {
            mealPlans = await MealPlan.findByUserAndDateRange(req.user.id, startDate, endDate);
        } else {
            mealPlans = await MealPlan.findByUser(req.user.id);
        }

        // Populate recipe details
        const mealPlansWithRecipes = await Promise.all(
            mealPlans.map(async (plan) => {
                const recipe = await Recipe.findById(plan.recipeId);
                return {
                    ...plan,
                    recipe: recipe ? {
                        id: recipe.id,
                        title: recipe.title,
                        image: recipe.image,
                        cookTime: recipe.cookTime,
                        difficulty: recipe.difficulty
                    } : null
                };
            })
        );

        res.json(mealPlansWithRecipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Remove meal from plan
// @route   DELETE /api/meal-plan/:id
// @access  Private
exports.removeMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({ error: 'Meal plan entry not found' });
        }

        // Check if user owns this meal plan entry
        if (mealPlan.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this meal plan entry' });
        }

        await MealPlan.delete(req.params.id);
        res.json({ message: 'Meal removed from plan' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
