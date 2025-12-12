const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', protect, messageController.sendMessage);
router.get('/conversations', protect, messageController.getConversations);
router.get('/:userId', protect, messageController.getMessages);

module.exports = router;
