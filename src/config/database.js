/** @import { ConnectOptions } from 'mongoose' */

// Dependencies
const mongoose = require('mongoose');

// Log
const log = require('../lib/log');

/**
 * Connection Options
 * Gives up on an unreachable MongoDB after 10 seconds instead of the driver's default 30, and names the app in MongoDB's server logs.
 *
 * @type {ConnectOptions}
 */
const CONNECTION_OPTIONS = {
    appName: 'kairo',
    serverSelectionTimeoutMS: 10000
};

// Settings
mongoose.set('strictQuery', true);

// Connection Events
mongoose.connection.on('disconnected', () => log.warn('DATABASE', 'Disconnected from MongoDB.'));
mongoose.connection.on('reconnected', () => log.success('DATABASE', 'Reconnected to MongoDB.'));

/**
 * Connect Database
 * Connects to MongoDB at `MONGO_URI` and logs how long it took. Logs and rethrows on failure, so the caller decides whether to exit.
 *
 * @returns {Promise<void>} Resolves once connected.
 * @throws {Error} If MongoDB can't be reached within the connection timeout.
 */
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