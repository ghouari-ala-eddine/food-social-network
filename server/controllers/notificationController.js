const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findByUser(req.user.id);

        // Populate fromUser data
        const populatedNotifications = await Promise.all(
            notifications.map(async (notification) => {
                const fromUser = await User.findById(notification.fromUserId);
                return {
                    ...notification,
                    fromUser: fromUser ? {
                        id: fromUser.id,
                        username: fromUser.username,
                        profilePicture: fromUser.profilePicture
                    } : null
                };
            })
        );

        res.json(populatedNotifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user.id);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.markAsRead(parseInt(req.params.id));
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
