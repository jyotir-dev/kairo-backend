// Dependencies
const mongoose = require('mongoose');

// Wallet Schema
const walletSchema = new mongoose.Schema({

    // Public Key
    publicKey: {
        type: String,
        required: true
    },

    // Encrypted Private Key
    encryptedPrivateKey: {
        type: String,
        required: true,
        select: false
    }
},
    {
        _id: false
    });

// Payout Schema
const payoutSchema = new mongoose.Schema({

    // Address
    address: {
        type: String,
        required: true
    },

    // Signature
    signature: {
        type: String
    },

    // Paid At
    paidAt: {
        type: Date
    }
},
    {
        _id: false
    });

// Escrow Schema
const escrowSchema = new mongoose.Schema({

    // Public ID
    publicID: {
        type: String,
        required: true,
        unique: true
    },

    // Creator
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Sender
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Receiver
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Title
    title: {
        type: String,
        required: true
    },

    // Description
    description: {
        type: String
    },

    // Amount
    amount: {
        type: Number,
        required: true,
        min: 0
    },

    // Status
    status: {
        type: String,
        required: true
    },

    // Wallet
    wallet: {
        type: walletSchema,
        default: undefined
    },
    
    // Payout
    payout: {
        type: payoutSchema,
        default: undefined
    }
},
    {
        timestamps: true
    });

// Escrow Model
const Escrow = mongoose.model('Escrow', escrowSchema)

// Export Escrow Model
module.exports = Escrow;