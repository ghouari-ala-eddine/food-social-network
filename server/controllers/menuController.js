const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private (Restaurant only)
exports.createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        // Verify user is a restaurant
        const restaurant = await User.findById(req.user.id);
        if (restaurant.accountType !== 'restaurant') {
            return res.status(403).json({ error: 'Only restaurants can create menu items' });
        }

        const menuItem = await MenuItem.create({
            restaurantId: req.user.id,
            name,
            description,
            price,
            category,
            image
        });

        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get restaurant menu
// @route   GET /api/menu/restaurant/:id
// @access  Public
exports.getRestaurantMenu = async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.id);
        const menuItems = await MenuItem.findByRestaurant(restaurantId);
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Restaurant only)
exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(parseInt(req.params.id));

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        if (menuItem.restaurantId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updated = await MenuItem.update(parseInt(req.params.id), req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Restaurant only)
exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(parseInt(req.params.id));

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        if (menuItem.restaurantId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await MenuItem.delete(parseInt(req.params.id));
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/menu/:id/availability
// @access  Private (Restaurant only)
exports.toggleAvailability = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(parseInt(req.params.id));

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        if (menuItem.restaurantId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        menuItem.available = !menuItem.available;
        menuItem.updatedAt = new Date();

        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
