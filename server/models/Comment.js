// In-memory comment storage
const comments = [];
let commentIdCounter = 1;

class Comment {
    constructor(data) {
        this.id = commentIdCounter++;
        this.recipeId = data.recipeId;
        this.userId = data.userId;
        this.text = data.text;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async create(commentData) {
        const comment = new Comment(commentData);
        comments.push(comment);
        return comment;
    }

    static async findByRecipe(recipeId) {
        return comments
            .filter(c => c.recipeId === parseInt(recipeId))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    static async findById(id) {
        return comments.find(c => c.id === parseInt(id));
    }

    static async update(id, updates) {
        const comment = comments.find(c => c.id === parseInt(id));
        if (comment) {
            Object.assign(comment, updates);
            comment.updatedAt = new Date();
            return comment;
        }
        return null;
    }

    static async delete(id) {
        const index = comments.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            comments.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = Comment;
