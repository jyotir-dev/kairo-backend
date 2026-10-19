// Dependencies
const crypto = require('crypto');

// Settings
const IV_LENGTH = 12;
const VERSION = 'v1';
const ALGORITHM = 'aes-256-gcm';

const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// Encrypt
exports.encrypt = (plaintext) => {

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [
        VERSION,
        iv.toString('base64'),
        authTag.toString('base64'),
        ciphertext.toString('base64')
    ].join(':');
};

// Decrypt
exports.decrypt = (payload) => {

    const [version, iv, authTag, ciphertext] = payload.split(':');

    if (version !== VERSION) {
        throw new Error(`Unsupported encryption version: ${version}`);
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    return Buffer.concat([
        decipher.update(Buffer.from(ciphertext, 'base64')),
        decipher.final()
    ]).toString('utf8');
};