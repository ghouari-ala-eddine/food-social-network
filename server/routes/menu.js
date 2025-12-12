const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect } = require('../middleware/auth');

router.post('/', protect, menuController.createMenuItem);
router.get('/restaurant/:id', menuController.getRestaurantMenu);
router.put('/:id', protect, menuController.updateMenuItem);
router.delete('/:id', protect, menuController.deleteMenuItem);
router.patch('/:id/availability', protect, menuController.toggleAvailability);

module.exports = router;
