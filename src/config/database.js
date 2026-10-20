// Dependencies
const mongoose = require('mongoose');

// Log
const log = require('../lib/log');

// Connection Options
const CONNECTION_OPTIONS = {
    appName: 'kairo',
    serverSelectionTimeoutMS: 10000
};

// Settings
mongoose.set('strictQuery', true);

// Connection Events
mongoose.connection.on('disconnected', () => log.warn('DATABASE', 'yellow', 'Disconnected from MongoDB.'));
mongoose.connection.on('reconnected', () => log.success('DATABASE', 'green', 'Reconnected to MongoDB.'));

// Connect Database
module.exports = async () => {

    const start = Date.now();

    try {
        await mongoose.connect(process.env.MONGO_URI, CONNECTION_OPTIONS);
        log.success('DATABASE', `Connected to "${mongoose.connection.name}"`, `${Date.now() - start}ms`);
    } catch (error) {
        log.warn('DATABASE', `Failed to connect: ${error.message}`);
        throw error;
    }
};