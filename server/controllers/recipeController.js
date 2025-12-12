const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cookTime, servings, difficulty, image } = req.body;

        if (!title || !description || !ingredients || !instructions) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            cookTime,
            servings,
            difficulty,
            image,
            author: req.user.id
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();

        // Populate author information
        const recipesWithAuthors = await Promise.all(
            recipes.map(async (recipe) => {
                const author = await User.findById(recipe.author);
                return {
                    ...recipe,
                    author: author ? { id: author.id, username: author.username } : null
                };
            })
        );

        res.json(recipesWithAuthors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Populate author information
        const author = await User.findById(recipe.author);
        const recipeWithAuthor = {
            ...recipe,
            author: author ? { id: author.id, username: author.username } : null
        };

        res.json(recipeWithAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check if user is the author
        if (recipe.author !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this recipe' });
        }

        const updatedRecipe = await Recipe.update(req.params.id, req.body);
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check if user is the author
        if (recipe.author !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this recipe' });
        }

        await Recipe.delete(req.params.id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Toggle like on recipe
// @route   POST /api/recipes/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const wasLiked = recipe.likes.includes(req.user.id);
        const updatedRecipe = await Recipe.toggleLike(req.params.id, req.user.id);

        // Create notification if user liked (not unliked) and not their own recipe
        if (!wasLiked && recipe.author !== req.user.id) {
            const Notification = require('../models/Notification');
            const User = require('../models/User');
            const liker = await User.findById(req.user.id);

            await Notification.create({
                userId: recipe.author,
                type: 'like',
                fromUserId: req.user.id,
                message: `${liker?.username || 'Someone'} liked your recipe "${recipe.title}"`,
                link: `/recipes/${recipe.id}`
            });
        }

        // Populate author information
        const User = require('../models/User');
        const author = await User.findById(updatedRecipe.author);

        res.json({
            ...updatedRecipe,
            author: author ? { id: author.id, username: author.username } : null,
            likesCount: updatedRecipe.likes.length,
            isLiked: updatedRecipe.likes.includes(req.user.id)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
