const storage = require('../utils/storage');

const COLLECTION = 'reservations';

class Reservation {
    constructor(userId, restaurantId, date, time, partySize, specialRequests) {
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.date = date;
        this.time = time;
        this.partySize = partySize;
        this.specialRequests = specialRequests || '';
        this.status = 'pending';
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create(reservationData) {
        const reservation = new Reservation(
            reservationData.userId,
            reservationData.restaurantId,
            reservationData.date,
            reservationData.time,
            reservationData.partySize,
            reservationData.specialRequests
        );
        return storage.addItem(COLLECTION, reservation);
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async findByUser(userId) {
        const reservations = storage.getAll(COLLECTION);
        return reservations
            .filter(r => r.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static async findByRestaurant(restaurantId) {
        const reservations = storage.getAll(COLLECTION);
        return reservations
            .filter(r => r.restaurantId === restaurantId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static async update(id, updates) {
        updates.updatedAt = new Date().toISOString();
        return storage.updateById(COLLECTION, id, updates);
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id) !== null;
    }

    static async getAll() {
        return storage.getAll(COLLECTION);
    }
}

module.exports = Reservation;
