const storage = require('../utils/storage');

const COLLECTION = 'recipes';

class Recipe {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.ingredients = data.ingredients || [];
        this.instructions = data.instructions || [];
        this.cookTime = data.cookTime;
        this.servings = data.servings;
        this.difficulty = data.difficulty || 'Medium';
        this.image = data.image || '';
        this.author = data.author;
        this.likes = [];
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create(recipeData) {
        const recipe = new Recipe(recipeData);
        return storage.addItem(COLLECTION, recipe);
    }

    static async findAll() {
        return storage.getAll(COLLECTION);
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async findByAuthor(authorId) {
        return storage.findMany(COLLECTION, { author: authorId });
    }

    static async update(id, updateData) {
        updateData.updatedAt = new Date().toISOString();
        return storage.updateById(COLLECTION, id, updateData);
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id);
    }

    static async toggleLike(recipeId, userId) {
        const recipe = storage.findById(COLLECTION, recipeId);
        if (!recipe) return null;

        const likeIndex = recipe.likes.indexOf(userId);
        if (likeIndex === -1) {
            recipe.likes.push(userId);
        } else {
            recipe.likes.splice(likeIndex, 1);
        }
        return storage.updateById(COLLECTION, recipeId, { likes: recipe.likes });
    }

    static async isLikedByUser(recipeId, userId) {
        const recipe = storage.findById(COLLECTION, recipeId);
        if (!recipe) return false;
        return recipe.likes.includes(userId);
    }
}

module.exports = Recipe;
