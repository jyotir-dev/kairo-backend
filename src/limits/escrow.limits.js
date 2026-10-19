// Create
exports.create = {
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: 'Too many escrows created. Please try again in an hour.'
};

// Respond
exports.respond = {
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: 'Too many responses. Please try again in 15 minutes.'
};

// Payout
exports.payout = {
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: 'Too many payout requests. Please try again in 15 minutes.'
};