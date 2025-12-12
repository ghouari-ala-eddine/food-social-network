const fs = require('fs');
const path = require('path');

// In-memory cache for all collections (fallback when file system fails)
const memoryCache = {};

// Directory to store JSON data files
const DATA_DIR = path.join(__dirname, '../data');

// Try to create data directory
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
} catch (error) {
    console.log('Data directory creation failed, using memory-only mode');
}

// Get file path for a collection
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

// Initialize memory cache for a collection
const initCache = (collection) => {
    if (!memoryCache[collection]) {
        memoryCache[collection] = { items: [], counter: 1 };
        // Try to load from file
        try {
            const filePath = getFilePath(collection);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                memoryCache[collection] = JSON.parse(data);
            }
        } catch (error) {
            console.log(`Using memory cache for ${collection}`);
        }
    }
    return memoryCache[collection];
};

// Read data from cache (with file fallback)
const readData = (collection) => {
    return initCache(collection);
};

// Write data to cache and try to persist to file
const writeData = (collection, data) => {
    memoryCache[collection] = data;
    try {
        const filePath = getFilePath(collection);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        // File write failed, but data is in memory cache
        console.log(`File write failed for ${collection}, data is in memory`);
    }
    return true;
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
