const storage = require('../utils/storage');

const COLLECTION = 'menuitems';

class MenuItem {
    constructor(restaurantId, name, description, price, category, image) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image || '';
        this.available = true;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create(itemData) {
        const item = new MenuItem(
            itemData.restaurantId,
            itemData.name,
            itemData.description,
            itemData.price,
            itemData.category,
            itemData.image
        );
        return storage.addItem(COLLECTION, item);
    }

    static async findByRestaurant(restaurantId) {
        return storage.findMany(COLLECTION, { restaurantId });
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async update(id, updates) {
        updates.updatedAt = new Date().toISOString();
        return storage.updateById(COLLECTION, id, updates);
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id) !== null;
    }
}

module.exports = MenuItem;
