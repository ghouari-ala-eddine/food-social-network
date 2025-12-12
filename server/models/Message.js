const storage = require('../utils/storage');

const COLLECTION = 'messages';

class Message {
    constructor(senderId, receiverId, content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.read = false;
        this.createdAt = new Date().toISOString();
    }

    static async create(messageData) {
        const message = new Message(
            messageData.senderId,
            messageData.receiverId,
            messageData.content
        );
        return storage.addItem(COLLECTION, message);
    }

    static async findByUsers(userId1, userId2) {
        const messages = storage.getAll(COLLECTION);
        return messages.filter(m =>
            (m.senderId === userId1 && m.receiverId === userId2) ||
            (m.senderId === userId2 && m.receiverId === userId1)
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    static async getConversations(userId) {
        const messages = storage.getAll(COLLECTION);
        const userMessages = messages.filter(m =>
            m.senderId === userId || m.receiverId === userId
        );

        const conversationMap = new Map();
        userMessages.forEach(msg => {
            const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, []);
            }
            conversationMap.get(partnerId).push(msg);
        });

        const conversations = [];
        conversationMap.forEach((msgs, partnerId) => {
            const lastMessage = msgs[msgs.length - 1];
            const unreadCount = msgs.filter(m =>
                m.receiverId === userId && !m.read
            ).length;
            conversations.push({
                partnerId,
                lastMessage,
                unreadCount
            });
        });

        return conversations.sort((a, b) =>
            new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
    }

    static async markAsRead(messageId) {
        return storage.updateById(COLLECTION, messageId, { read: true });
    }

    static async markConversationAsRead(userId, partnerId) {
        const messages = storage.getAll(COLLECTION);
        messages.forEach(m => {
            if (m.senderId === partnerId && m.receiverId === userId) {
                storage.updateById(COLLECTION, m.id, { read: true });
            }
        });
    }
}

module.exports = Message;
