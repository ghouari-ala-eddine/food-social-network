// In-memory user storage (for development without MongoDB)
const users = [];
let userIdCounter = 1;

class User {
    constructor(username, email, password, accountType = 'user') {
        this.id = userIdCounter++;
        this.username = username;
        this.email = email;
        this.password = password;
        this.accountType = accountType; // 'user' or 'restaurant'
        this.profilePicture = '';
        this.bio = '';
        this.followers = [];
        this.following = [];

        // Restaurant-specific fields
        this.restaurantName = accountType === 'restaurant' ? username : '';
        this.description = '';
        this.address = '';
        this.phone = '';
        this.location = null; // { lat, lng }
        this.openingHours = '';
        this.cuisine = []; // array of cuisine types
        this.averageRating = 0;
        this.totalRatings = 0;

        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async create(userData) {
        const user = new User(
            userData.username,
            userData.email,
            userData.password,
            userData.accountType || 'user'
        );
        users.push(user);
        return user;
    }

    static async findOne(query) {
        return users.find(user => {
            if (query.email) return user.email === query.email;
            if (query.username) return user.username === query.username;
            if (query.id) return user.id === query.id;
            return false;
        });
    }

    static async findById(id) {
        return users.find(user => user.id === id);
    }

    static async update(id, updates) {
        console.log(`User.update called for ID: ${id} with updates:`, updates);
        const user = users.find(user => user.id === id);
        if (user) {
            console.log('User found before update:', JSON.stringify(user));
            Object.assign(user, updates);
            user.updatedAt = new Date();
            console.log('User after update:', JSON.stringify(user));
            return user;
        }
        console.log('User NOT found for update!');
        return null;
    }

    static async getAll() {
        return users;
    }
}

module.exports = User;
