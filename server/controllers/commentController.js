const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get comments for a recipe
// @route   GET /api/comments/recipe/:recipeId
// @access  Public
exports.getRecipeComments = async (req, res) => {
    try {
        const recipeId = parseInt(req.params.recipeId);
        const comments = await Comment.findByRecipe(recipeId);

        // Populate user data for each comment
        const populatedComments = await Promise.all(
            comments.map(async (comment) => {
                const user = await User.findById(comment.userId);
                return {
                    ...comment,
                    user: user ? {
                        id: user.id,
                        username: user.username,
                        profilePicture: user.profilePicture
                    } : null
                };
            })
        );

        res.json(populatedComments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Add comment to recipe
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { recipeId, text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const comment = await Comment.create({
            recipeId: parseInt(recipeId),
            userId: req.user.id,
            text: text.trim()
        });

        // Get recipe to find author and create notification
        const Recipe = require('../models/Recipe');
        const recipe = await Recipe.findById(recipeId);

        // Create notification if commenter is not the recipe author
        if (recipe && recipe.author !== req.user.id) {
            const Notification = require('../models/Notification');
            const commenter = await User.findById(req.user.id);

            await Notification.create({
                userId: recipe.author,
                type: 'comment',
                fromUserId: req.user.id,
                message: `${commenter?.username || 'Someone'} commented on your recipe "${recipe.title}"`,
                link: `/recipes/${recipe.id}`
            });
        }

        // Populate user data
        const user = await User.findById(req.user.id);
        const populatedComment = {
            ...comment,
            user: user ? {
                id: user.id,
                username: user.username,
                profilePicture: user.profilePicture
            } : null
        };

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if user owns this comment
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const updatedComment = await Comment.update(req.params.id, { text: text.trim() });
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if user owns this comment
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Comment.delete(req.params.id);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
