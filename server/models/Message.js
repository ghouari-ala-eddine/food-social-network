// In-memory message storage
const messages = [];
let messageIdCounter = 1;

class Message {
    constructor(senderId, receiverId, content) {
        this.id = messageIdCounter++;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.read = false;
        this.createdAt = new Date();
    }

    static async create(messageData) {
        const message = new Message(
            messageData.senderId,
            messageData.receiverId,
            messageData.content
        );
        messages.push(message);
        return message;
    }

    static async findByUsers(userId1, userId2) {
        return messages.filter(m =>
            (m.senderId === userId1 && m.receiverId === userId2) ||
            (m.senderId === userId2 && m.receiverId === userId1)
        ).sort((a, b) => a.createdAt - b.createdAt);
    }

    static async getConversations(userId) {
        const userMessages = messages.filter(m =>
            m.senderId === userId || m.receiverId === userId
        );

        // Group by conversation partner
        const conversationMap = new Map();
        userMessages.forEach(msg => {
            const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, []);
            }
            conversationMap.get(partnerId).push(msg);
        });

        // Get last message for each conversation
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
            b.lastMessage.createdAt - a.lastMessage.createdAt
        );
    }

    static async markAsRead(messageId) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            message.read = true;
            return message;
        }
        return null;
    }

    static async markConversationAsRead(userId, partnerId) {
        messages.forEach(m => {
            if (m.senderId === partnerId && m.receiverId === userId) {
                m.read = true;
            }
        });
    }
}

module.exports = Message;
