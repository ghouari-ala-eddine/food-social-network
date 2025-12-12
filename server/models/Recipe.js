// In-memory recipe storage
const recipes = [];
let recipeIdCounter = 1;

class Recipe {
    constructor(data) {
        this.id = recipeIdCounter++;
        this.title = data.title;
        this.description = data.description;
        this.ingredients = data.ingredients || [];
        this.instructions = data.instructions || [];
        this.cookTime = data.cookTime;
        this.servings = data.servings;
        this.difficulty = data.difficulty || 'Medium';
        this.image = data.image || '';
        this.author = data.author; // user ID
        this.likes = []; // array of user IDs who liked this recipe
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async create(recipeData) {
        const recipe = new Recipe(recipeData);
        recipes.push(recipe);
        return recipe;
    }

    static async findAll() {
        return recipes;
    }

    static async findById(id) {
        return recipes.find(recipe => recipe.id === parseInt(id));
    }

    static async findByAuthor(authorId) {
        return recipes.filter(recipe => recipe.author === authorId);
    }

    static async update(id, updateData) {
        const index = recipes.findIndex(recipe => recipe.id === parseInt(id));
        if (index === -1) return null;

        recipes[index] = {
            ...recipes[index],
            ...updateData,
            id: recipes[index].id,
            author: recipes[index].author,
            createdAt: recipes[index].createdAt,
            updatedAt: new Date()
        };
        return recipes[index];
    }

    static async delete(id) {
        const index = recipes.findIndex(recipe => recipe.id === parseInt(id));
        if (index === -1) return null;

        const deleted = recipes.splice(index, 1);
        return deleted[0];
    }

    static async toggleLike(recipeId, userId) {
        const recipe = recipes.find(r => r.id === parseInt(recipeId));
        if (!recipe) return null;

        const likeIndex = recipe.likes.indexOf(userId);
        if (likeIndex === -1) {
            recipe.likes.push(userId);
        } else {
            recipe.likes.splice(likeIndex, 1);
        }
        return recipe;
    }

    static async isLikedByUser(recipeId, userId) {
        const recipe = recipes.find(r => r.id === parseInt(recipeId));
        if (!recipe) return false;
        return recipe.likes.includes(userId);
    }
}

module.exports = Recipe;
