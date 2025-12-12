// In-memory reservation storage
const reservations = [];
let reservationIdCounter = 1;

class Reservation {
    constructor(userId, restaurantId, date, time, partySize, specialRequests) {
        this.id = reservationIdCounter++;
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.date = date; // YYYY-MM-DD
        this.time = time; // HH:MM
        this.partySize = partySize;
        this.specialRequests = specialRequests || '';
        this.status = 'pending'; // pending, confirmed, cancelled, completed
        this.createdAt = new Date();
        this.updatedAt = new Date();
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
        reservations.push(reservation);
        return reservation;
    }

    static async findById(id) {
        return reservations.find(r => r.id === id);
    }

    static async findByUser(userId) {
        return reservations
            .filter(r => r.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static async findByRestaurant(restaurantId) {
        return reservations
            .filter(r => r.restaurantId === restaurantId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static async update(id, updates) {
        const reservation = reservations.find(r => r.id === id);
        if (reservation) {
            Object.assign(reservation, updates);
            reservation.updatedAt = new Date();
            return reservation;
        }
        return null;
    }

    static async delete(id) {
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            reservations.splice(index, 1);
            return true;
        }
        return false;
    }

    static async getAll() {
        return reservations;
    }
}

module.exports = Reservation;
