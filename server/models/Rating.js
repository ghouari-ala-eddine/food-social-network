const storage = require('../utils/storage');

const COLLECTION = 'ratings';

class Rating {
    constructor(restaurantId, userId, rating, review) {
        this.restaurantId = restaurantId;
        this.userId = userId;
        this.rating = rating;
        this.review = review || '';
        this.createdAt = new Date().toISOString();
    }

    static async create(ratingData) {
        const rating = new Rating(
            ratingData.restaurantId,
            ratingData.userId,
            ratingData.rating,
            ratingData.review
        );
        return storage.addItem(COLLECTION, rating);
    }

    static async findByRestaurant(restaurantId) {
        const ratings = storage.getAll(COLLECTION);
        return ratings
            .filter(r => r.restaurantId === restaurantId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    static async findByUser(userId) {
        return storage.findMany(COLLECTION, { userId });
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async getAverageRating(restaurantId) {
        const ratings = storage.getAll(COLLECTION);
        const restaurantRatings = ratings.filter(r => r.restaurantId === restaurantId);
        if (restaurantRatings.length === 0) return 0;

        const sum = restaurantRatings.reduce((acc, r) => acc + r.rating, 0);
        return sum / restaurantRatings.length;
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id) !== null;
    }
}

module.exports = Rating;
