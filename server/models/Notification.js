const storage = require('../utils/storage');

const COLLECTION = 'notifications';

class Notification {
    constructor(userId, type, fromUserId, message, link = null) {
        this.userId = userId;
        this.type = type;
        this.fromUserId = fromUserId;
        this.message = message;
        this.link = link;
        this.read = false;
        this.createdAt = new Date().toISOString();
    }

    static async create(notificationData) {
        const notification = new Notification(
            notificationData.userId,
            notificationData.type,
            notificationData.fromUserId,
            notificationData.message,
            notificationData.link
        );
        return storage.addItem(COLLECTION, notification);
    }

    static async findByUser(userId) {
        const notifications = storage.getAll(COLLECTION);
        return notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    static async markAsRead(id) {
        return storage.updateById(COLLECTION, id, { read: true });
    }

    static async markAllAsRead(userId) {
        const notifications = storage.getAll(COLLECTION);
        notifications.forEach(n => {
            if (n.userId === userId) {
                storage.updateById(COLLECTION, n.id, { read: true });
            }
        });
    }

    static async getUnreadCount(userId) {
        const notifications = storage.getAll(COLLECTION);
        return notifications.filter(n => n.userId === userId && !n.read).length;
    }
}

module.exports = Notification;
