// Dependencies
const { PublicKey } = require('@solana/web3.js');

// Enums
const { 
    ESCROW_ROLE,
    ESCROW_ACTION 
} = require('../enums/escrow.enums');

// Errors
const { BadRequestError } = require('../errors/http.errors');

// Regex
const PUBLIC_ID_REGEX = /^[a-f0-9]{16}$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,9})?$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

// Limits
const USERNAME_MIN = 3;
const USERNAME_MAX = 32;
const TITLE_MAX = 100;
const DESCRIPTION_MAX = 1000;
const AMOUNT_MIN = 0.001;
const AMOUNT_MAX = 1000;

// Create Validation
exports.create = ({ body, params, query }) => {

    const { role, username, title, description, amount } = body;

    // Role
    if (!Object.values(ESCROW_ROLE).includes(role)) {
        throw new BadRequestError('Role must be either sender or receiver.');
    }

    // Username
    if (typeof username !== 'string' || !username.trim()) {
        throw new BadRequestError('Username is required.');
    }

    if (username.trim().length < USERNAME_MIN || username.trim().length > USERNAME_MAX || !USERNAME_REGEX.test(username.trim())) {
        throw new BadRequestError('Invalid username.');
    }

    // Title
    if (typeof title !== 'string' || !title.trim()) {
        throw new BadRequestError('Title is required.');
    }

    if (title.trim().length > TITLE_MAX) {
        throw new BadRequestError(`Title must be at most ${TITLE_MAX} characters.`);
    }

    // Description
    if (description !== undefined && description !== null) {

        if (typeof description !== 'string') {
            throw new BadRequestError('Description must be text.');
        }

        if (description.trim().length > DESCRIPTION_MAX) {
            throw new BadRequestError(`Description must be at most ${DESCRIPTION_MAX} characters.`);
        }
    }

    // Amount
    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
        throw new BadRequestError('Amount must be a number.');
    }

    if (amount < AMOUNT_MIN || amount > AMOUNT_MAX) {
        throw new BadRequestError(`Amount must be between ${AMOUNT_MIN} and ${AMOUNT_MAX} SOL.`);
    }

    if (!AMOUNT_REGEX.test(String(amount))) {
        throw new BadRequestError('Amount can have at most 9 decimal places.');
    }
};

// Public ID Validation
exports.publicID = ({ body, params, query }) => {

    const { publicID } = params;

    // Public ID
    if (typeof publicID !== 'string' || !PUBLIC_ID_REGEX.test(publicID)) {
        throw new BadRequestError('Invalid escrow public ID.');
    }
};

// Respond Validation
exports.respond = ({ body, params, query }) => {

    const { action } = body;
    const { publicID } = params;

    // Public ID
    if (typeof publicID !== 'string' || !PUBLIC_ID_REGEX.test(publicID)) {
        throw new BadRequestError('Invalid escrow public ID.');
    }

    // Action
    if (!Object.values(ESCROW_ACTION).includes(action)) {
        throw new BadRequestError('Action must be either accept or deny.');
    }
};

// Release Validation
exports.release = ({ body, params, query }) => {

    const { publicID } = params;

    // Public ID
    if (typeof publicID !== 'string' || !PUBLIC_ID_REGEX.test(publicID)) {
        throw new BadRequestError('Invalid escrow public ID.');
    }
};

// Withdraw Validation
exports.withdraw = ({ body, params, query }) => {

    const { address } = body;
    const { publicID } = params;

    // Public ID
    if (typeof publicID !== 'string' || !PUBLIC_ID_REGEX.test(publicID)) {
        throw new BadRequestError('Invalid escrow public ID.');
    }

    // Address
    if (typeof address !== 'string' || !address.trim()) {
        throw new BadRequestError('Withdrawal address is required.');
    }

    try {
        new PublicKey(address.trim());
    } catch {
        throw new BadRequestError('Invalid Solana wallet address.');
    }
};