const fs = require('fs');
const path = require('path');

// Directory to store JSON data files
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Get file path for a collection
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

// Read data from JSON file
const readData = (collection) => {
    const filePath = getFilePath(collection);
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Error reading ${collection}:`, error.message);
    }
    return { items: [], counter: 1 };
};

// Write data to JSON file
const writeData = (collection, data) => {
    const filePath = getFilePath(collection);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${collection}:`, error.message);
        return false;
    }
};

// Get all items from a collection
const getAll = (collection) => {
    const data = readData(collection);
    return data.items;
};

// Get next ID for a collection
const getNextId = (collection) => {
    const data = readData(collection);
    return data.counter;
};

// Add item to collection
const addItem = (collection, item) => {
    const data = readData(collection);
    item.id = data.counter++;
    data.items.push(item);
    writeData(collection, data);
    return item;
};

// Find item by ID
const findById = (collection, id) => {
    const items = getAll(collection);
    return items.find(item => item.id === parseInt(id));
};

// Find item by query
const findOne = (collection, query) => {
    const items = getAll(collection);
    return items.find(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });
};

// Find items by query
const findMany = (collection, query) => {
    const items = getAll(collection);
    if (!query || Object.keys(query).length === 0) {
        return items;
    }
    return items.filter(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });
};

// Update item by ID
const updateById = (collection, id, updates) => {
    const data = readData(collection);
    const index = data.items.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;

    data.items[index] = { ...data.items[index], ...updates, id: parseInt(id) };
    writeData(collection, data);
    return data.items[index];
};

// Delete item by ID
const deleteById = (collection, id) => {
    const data = readData(collection);
    const index = data.items.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;

    const deleted = data.items.splice(index, 1)[0];
    writeData(collection, data);
    return deleted;
};

module.exports = {
    readData,
    writeData,
    getAll,
    getNextId,
    addItem,
    findById,
    findOne,
    findMany,
    updateById,
    deleteById
};
