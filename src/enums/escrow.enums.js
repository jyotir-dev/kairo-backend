// Escrow Status
const ESCROW_STATUS = Object.freeze({
    PENDING_ACCEPT: 'PENDING_ACCEPT',
    WAITING_FOR_DEPOSIT: 'WAITING_FOR_DEPOSIT',
    FUNDED: 'FUNDED',
    RELEASED: 'RELEASED',
    WITHDRAWING: 'WITHDRAWING',
    COMPLETED: 'COMPLETED',
    DENIED: 'DENIED'
});

// Escrow Role
const ESCROW_ROLE = Object.freeze({
    SENDER: 'sender',
    RECEIVER: 'receiver'
});

// Escrow Action
const ESCROW_ACTION = Object.freeze({
    ACCEPT: 'accept',
    DENY: 'deny'
});

// Export Constants
module.exports = {
    ESCROW_STATUS,
    ESCROW_ROLE,
    ESCROW_ACTION
};