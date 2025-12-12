// In-memory offer storage
const offers = [];
let offerIdCounter = 1;

class Offer {
    constructor(restaurantId, title, description, discount, validUntil, image) {
        this.id = offerIdCounter++;
        this.restaurantId = restaurantId;
        this.title = title;
        this.description = description;
        this.discount = discount; // percentage or amount
        this.validUntil = validUntil;
        this.image = image || '';
        this.createdAt = new Date();
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
        offers.push(offer);
        return offer;
    }

    static async getActive() {
        const now = new Date();
        return offers.filter(offer => new Date(offer.validUntil) > now);
    }

    static async findByRestaurant(restaurantId) {
        return offers.filter(offer => offer.restaurantId === restaurantId);
    }

    static async findById(id) {
        return offers.find(offer => offer.id === id);
    }

    static async delete(id) {
        const index = offers.findIndex(offer => offer.id === id);
        if (index !== -1) {
            offers.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = Offer;
