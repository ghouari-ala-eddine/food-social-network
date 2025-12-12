// In-memory rating storage
const ratings = [];
let ratingIdCounter = 1;

class Rating {
    constructor(restaurantId, userId, rating, review) {
        this.id = ratingIdCounter++;
        this.restaurantId = restaurantId;
        this.userId = userId;
        this.rating = rating; // 1-5
        this.review = review || '';
        this.createdAt = new Date();
    }

    static async create(ratingData) {
        const rating = new Rating(
            ratingData.restaurantId,
            ratingData.userId,
            ratingData.rating,
            ratingData.review
        );
        ratings.push(rating);
        return rating;
    }

    static async findByRestaurant(restaurantId) {
        return ratings.filter(r => r.restaurantId === restaurantId)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    static async findByUser(userId) {
        return ratings.filter(r => r.userId === userId);
    }

    static async findById(id) {
        return ratings.find(r => r.id === id);
    }

    static async getAverageRating(restaurantId) {
        const restaurantRatings = ratings.filter(r => r.restaurantId === restaurantId);
        if (restaurantRatings.length === 0) return 0;

        const sum = restaurantRatings.reduce((acc, r) => acc + r.rating, 0);
        return sum / restaurantRatings.length;
    }

    static async delete(id) {
        const index = ratings.findIndex(r => r.id === id);
        if (index !== -1) {
            ratings.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = Rating;
