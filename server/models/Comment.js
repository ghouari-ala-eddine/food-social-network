const storage = require('../utils/storage');

const COLLECTION = 'comments';

class Comment {
    constructor(data) {
        this.recipeId = data.recipeId;
        this.userId = data.userId;
        this.text = data.text;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create(commentData) {
        const comment = new Comment(commentData);
        return storage.addItem(COLLECTION, comment);
    }

    static async findByRecipe(recipeId) {
        const comments = storage.getAll(COLLECTION);
        return comments
            .filter(c => c.recipeId === parseInt(recipeId))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async update(id, updates) {
        updates.updatedAt = new Date().toISOString();
        return storage.updateById(COLLECTION, id, updates);
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id) !== null;
    }
}

module.exports = Comment;
