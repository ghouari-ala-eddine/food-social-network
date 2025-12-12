// In-memory menu item storage
const menuItems = [];
let menuItemIdCounter = 1;

class MenuItem {
    constructor(restaurantId, name, description, price, category, image) {
        this.id = menuItemIdCounter++;
        this.restaurantId = restaurantId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category; // 'appetizer', 'main', 'dessert', 'drink', etc.
        this.image = image || '';
        this.available = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
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
        menuItems.push(item);
        return item;
    }

    static async findByRestaurant(restaurantId) {
        return menuItems.filter(item => item.restaurantId === restaurantId);
    }

    static async findById(id) {
        return menuItems.find(item => item.id === id);
    }

    static async update(id, updates) {
        const item = menuItems.find(item => item.id === id);
        if (item) {
            Object.assign(item, updates);
            item.updatedAt = new Date();
            return item;
        }
        return null;
    }

    static async delete(id) {
        const index = menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
            menuItems.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = MenuItem;
