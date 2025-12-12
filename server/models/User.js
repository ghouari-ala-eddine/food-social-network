const storage = require('../utils/storage');

const COLLECTION = 'users';

class User {
    constructor(username, email, password, accountType = 'user') {
        this.username = username;
        this.email = email;
        this.password = password;
        this.accountType = accountType;
        this.profilePicture = '';
        this.bio = '';
        this.followers = [];
        this.following = [];

        // Restaurant-specific fields
        this.restaurantName = accountType === 'restaurant' ? username : '';
        this.description = '';
        this.address = '';
        this.phone = '';
        this.location = null;
        this.openingHours = '';
        this.cuisine = [];
        this.averageRating = 0;
        this.totalRatings = 0;

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create(userData) {
        const user = new User(
            userData.username,
            userData.email,
            userData.password,
            userData.accountType || 'user'
        );
        return storage.addItem(COLLECTION, user);
    }

    static async findOne(query) {
        return storage.findOne(COLLECTION, query);
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async update(id, updates) {
        updates.updatedAt = new Date().toISOString();
        return storage.updateById(COLLECTION, id, updates);
    }

    static async getAll() {
        return storage.getAll(COLLECTION);
    }
}

module.exports = User;
