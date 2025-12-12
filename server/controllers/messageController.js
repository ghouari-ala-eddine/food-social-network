const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        if (!content || !receiverId) {
            return res.status(400).json({ error: 'Content and receiver are required' });
        }

        const receiver = await User.findById(parseInt(receiverId));
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

        const message = await Message.create({
            senderId,
            receiverId: parseInt(receiverId),
            content
        });

        // Create notification for receiver
        const sender = await User.findById(senderId);
        await Notification.create({
            userId: parseInt(receiverId),
            type: 'message',
            fromUserId: senderId,
            message: `${sender.username} sent you a message`
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get conversations list
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Message.getConversations(req.user.id);

        // Populate partner user data
        const populatedConversations = await Promise.all(
            conversations.map(async (conv) => {
                const partner = await User.findById(conv.partnerId);
                return {
                    partner: partner ? {
                        id: partner.id,
                        username: partner.username,
                        profilePicture: partner.profilePicture
                    } : null,
                    lastMessage: conv.lastMessage,
                    unreadCount: conv.unreadCount
                };
            })
        );

        res.json(populatedConversations.filter(c => c.partner !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const partnerId = parseInt(req.params.userId);
        const currentUserId = req.user.id;

        const partner = await User.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ error: 'User not found' });
        }

        const messages = await Message.findByUsers(currentUserId, partnerId);

        // Mark messages as read
        await Message.markConversationAsRead(currentUserId, partnerId);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
