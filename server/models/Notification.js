// In-memory notification storage
const notifications = [];
let notificationIdCounter = 1;

class Notification {
    constructor(userId, type, fromUserId, message, link = null) {
        this.id = notificationIdCounter++;
        this.userId = userId;
        this.type = type; // 'follow', 'message', 'like', 'comment', 'reservation', 'reservation_confirmed'
        this.fromUserId = fromUserId;
        this.message = message;
        this.link = link; // URL to navigate to when clicked
        this.read = false;
        this.createdAt = new Date();
    }

    static async create(notificationData) {
        const notification = new Notification(
            notificationData.userId,
            notificationData.type,
            notificationData.fromUserId,
            notificationData.message,
            notificationData.link
        );
        notifications.push(notification);
        return notification;
    }

    static async findByUser(userId) {
        return notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
    }

    static async markAsRead(id) {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            return notification;
        }
        return null;
    }

    static async markAllAsRead(userId) {
        notifications.forEach(n => {
            if (n.userId === userId) {
                n.read = true;
            }
        });
    }

    static async getUnreadCount(userId) {
        return notifications.filter(n => n.userId === userId && !n.read).length;
    }
}

module.exports = Notification;
