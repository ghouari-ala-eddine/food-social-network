const storage = require('../utils/storage');

const COLLECTION = 'offers';

class Offer {
    constructor(restaurantId, title, description, discount, validUntil, image) {
        this.restaurantId = restaurantId;
        this.title = title;
        this.description = description;
        this.discount = discount;
        this.validUntil = validUntil;
        this.image = image || '';
        this.createdAt = new Date().toISOString();
    }

    static async create(offerData) {
        const offer = new Offer(
            offerData.restaurantId,
            offerData.title,
            offerData.description,
            offerData.discount,
            offerData.validUntil,
            offerData.image
        );
        return storage.addItem(COLLECTION, offer);
    }

    static async getActive() {
        const offers = storage.getAll(COLLECTION);
        const now = new Date();
        return offers.filter(offer => new Date(offer.validUntil) > now);
    }

    static async findByRestaurant(restaurantId) {
        return storage.findMany(COLLECTION, { restaurantId });
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id) !== null;
    }
}

module.exports = Offer;
