// Dependencies
const crypto = require('crypto');

// Models
const User = require('../models/user.model');
const Escrow = require('../models/escrow.model');

// Enums
const {
    ESCROW_STATUS,
    ESCROW_ROLE,
    ESCROW_ACTION
} = require('../enums/escrow.enums');

// Errors
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    ConflictError
} = require('../errors/http.errors');

// Blockchain
const wallet = require('../blockchain/wallet');

// Constants
const PUBLIC_ID_BYTES = 8;

// Watch Deposit
const watchDeposit = (escrow) => {

    const requiredLamports = wallet.toLamports(escrow.amount);

    const subscriptionID = wallet.subscribe(escrow.wallet.publicKey, async (balance) => {

        if (balance < requiredLamports) {
            return;
        }

        await Escrow.updateOne(
            {
                _id: escrow._id,
                status: ESCROW_STATUS.WAITING_FOR_DEPOSIT
            },
            { $set: { status: ESCROW_STATUS.FUNDED } }
        );

        await wallet.unsubscribe(subscriptionID);
    });
};

// Create
exports.create = async (user, body) => {

    const role = body.role.trim();
    const username = body.username.trim();
    const title = body.title.trim();
    const description = body.description?.trim() || '';
    const amount = body.amount;

    const partner = await User.findOne({ username });

    if (!partner) {
        throw new NotFoundError('User not found.', 'USER_NOT_FOUND');
    }

    if (partner._id.equals(user._id)) {
        throw new BadRequestError('You cannot create an escrow with yourself.', 'ESCROW_SELF_DEAL');
    }

    const isSender = role === ESCROW_ROLE.SENDER;

    const escrow = await Escrow.create({
        publicID: crypto.randomBytes(PUBLIC_ID_BYTES).toString('hex'),
        creator: user._id,
        sender: isSender ? user._id : partner._id,
        receiver: isSender ? partner._id : user._id,
        title,
        description,
        amount,
        status: ESCROW_STATUS.PENDING_ACCEPT
    });

    return {
        response: {
            success: true,
            message: 'Escrow created successfully.',
            escrow: {
                publicID: escrow.publicID,
                role,
                creator: true,
                sender: isSender ? user.username : partner.username,
                receiver: isSender ? partner.username : user.username,
                title: escrow.title,
                description: escrow.description,
                amount: escrow.amount,
                status: escrow.status,
                createdAt: escrow.createdAt
            }
        }
    };
};

// Escrows
exports.escrows = async (user) => {

    const escrows = await Escrow.find({
        $or: [
            { sender: user._id },
            { receiver: user._id }
        ]
    })
        .populate('sender', 'username')
        .populate('receiver', 'username')
        .sort({ createdAt: -1 })
        .lean();

    return {
        response: escrows.map((escrow) => ({
            publicID: escrow.publicID,
            role: escrow.sender._id.equals(user._id) ? ESCROW_ROLE.SENDER : ESCROW_ROLE.RECEIVER,
            creator: escrow.creator.equals(user._id),
            sender: escrow.sender.username,
            receiver: escrow.receiver.username,
            title: escrow.title,
            description: escrow.description,
            amount: escrow.amount,
            status: escrow.status,
            createdAt: escrow.createdAt
        }))
    };
};

// Escrow
exports.escrow = async (user, params) => {

    const publicID = params.publicID;

    const escrow = await Escrow.findOne({ publicID })
        .populate('sender', 'username')
        .populate('receiver', 'username')
        .lean();

    if (!escrow) {
        throw new NotFoundError('Escrow not found.', 'ESCROW_NOT_FOUND');
    }

    if (!escrow.sender._id.equals(user._id) && !escrow.receiver._id.equals(user._id)) {
        throw new ForbiddenError('You are not authorized to view this escrow.', 'ESCROW_ACCESS_DENIED');
    }

    return {
        response: {
            publicID: escrow.publicID,
            role: escrow.sender._id.equals(user._id) ? ESCROW_ROLE.SENDER : ESCROW_ROLE.RECEIVER,
            creator: escrow.creator.equals(user._id),
            sender: escrow.sender.username,
            receiver: escrow.receiver.username,
            title: escrow.title,
            description: escrow.description,
            amount: escrow.amount,
            status: escrow.status,
            createdAt: escrow.createdAt,
            address: escrow.wallet ? escrow.wallet.publicKey : null,
            payout: escrow.payout ? escrow.payout : null
        }
    };
};

// Respond
exports.respond = async (user, params, body) => {

    const publicID = params.publicID;
    const action = body.action;

    const escrow = await Escrow.findOne({ publicID });

    if (!escrow) {
        throw new NotFoundError('Escrow not found.', 'ESCROW_NOT_FOUND');
    }

    if (!escrow.sender.equals(user._id) && !escrow.receiver.equals(user._id)) {
        throw new ForbiddenError('You are not authorized to respond to this escrow.', 'ESCROW_ACCESS_DENIED');
    }

    if (escrow.creator.equals(user._id)) {
        throw new ForbiddenError('You cannot respond to an escrow you created.', 'ESCROW_ACCESS_DENIED');
    }

    // Deny
    if (action === ESCROW_ACTION.DENY) {

        const denied = await Escrow.findOneAndUpdate(
            {
                _id: escrow._id,
                status: ESCROW_STATUS.PENDING_ACCEPT
            },
            { $set: { status: ESCROW_STATUS.DENIED } },
            { returnDocument: 'after' }
        );

        if (!denied) {
            throw new ConflictError('This escrow has already been responded to.', 'ESCROW_ALREADY_RESPONDED');
        }

        return {
            response: {
                success: true,
                message: 'Escrow denied successfully.',
                escrow: {
                    publicID: denied.publicID,
                    status: denied.status
                }
            }
        };
    }

    // Accept
    const escrowWallet = wallet.create();

    const accepted = await Escrow.findOneAndUpdate(
        {
            _id: escrow._id,
            status: ESCROW_STATUS.PENDING_ACCEPT
        },
        {
            $set: {
                status: ESCROW_STATUS.WAITING_FOR_DEPOSIT,
                wallet: escrowWallet
            }
        },
        { returnDocument: 'after' }
    );

    if (!accepted) {
        throw new ConflictError('This escrow has already been responded to.', 'ESCROW_ALREADY_RESPONDED');
    }

    watchDeposit(accepted);

    return {
        response: {
            success: true,
            message: 'Escrow accepted successfully.',
            escrow: {
                publicID: accepted.publicID,
                status: accepted.status
            }
        }
    };
};

// Release
exports.release = async (user, params) => {

    const publicID = params.publicID;

    const escrow = await Escrow.findOne({ publicID });

    if (!escrow) {
        throw new NotFoundError('Escrow not found.', 'ESCROW_NOT_FOUND');
    }

    if (!escrow.sender.equals(user._id)) {
        throw new ForbiddenError('Only the sender can release this escrow.', 'ESCROW_ACCESS_DENIED');
    }

    const released = await Escrow.findOneAndUpdate(
        {
            _id: escrow._id,
            status: ESCROW_STATUS.FUNDED
        },
        { $set: { status: ESCROW_STATUS.RELEASED } },
        { returnDocument: 'after' }
    );

    if (!released) {
        throw new ConflictError('Escrow is not funded.', 'ESCROW_NOT_FUNDED');
    }

    return {
        response: {
            success: true,
            message: 'Funds released successfully.',
            escrow: {
                publicID: released.publicID,
                status: released.status
            }
        }
    };
};

// Withdraw
exports.withdraw = async (user, params, body) => {

    const publicID = params.publicID;
    const address = body.address.trim();

    const escrow = await Escrow.findOne({ publicID });

    if (!escrow) {
        throw new NotFoundError('Escrow not found.', 'ESCROW_NOT_FOUND');
    }

    if (!escrow.receiver.equals(user._id)) {
        throw new ForbiddenError('Only the receiver can withdraw from this escrow.', 'ESCROW_ACCESS_DENIED');
    }

    if (escrow.status === ESCROW_STATUS.COMPLETED) {
        throw new ConflictError('Funds have already been withdrawn.', 'ESCROW_ALREADY_WITHDRAWN');
    }

    // Claim
    const claimed = await Escrow.findOneAndUpdate(
        {
            _id: escrow._id,
            status: ESCROW_STATUS.RELEASED
        },
        { $set: { status: ESCROW_STATUS.WITHDRAWING } },
        { returnDocument: 'after' }
    ).select('+wallet.encryptedPrivateKey');

    if (!claimed) {
        throw new ConflictError('Escrow is not available for withdrawal.', 'ESCROW_NOT_RELEASED');
    }

    // Transfer
    let signature;

    try {
        signature = await wallet.transfer(claimed.wallet.encryptedPrivateKey, address);
    } catch (error) {
        await Escrow.updateOne(
            {
                _id: escrow._id,
                status: ESCROW_STATUS.WITHDRAWING
            },
            { $set: { status: ESCROW_STATUS.RELEASED } }
        );
        throw error;
    }

    // Complete
    await Escrow.updateOne(
        {
            _id: escrow._id,
            status: ESCROW_STATUS.WITHDRAWING
        },
        {
            $set: {
                status: ESCROW_STATUS.COMPLETED,
                payout: {
                    address,
                    signature,
                    paidAt: new Date()
                }
            }
        }
    );

    return {
        response: {
            success: true,
            message: 'Funds withdrawn successfully.',
            signature,
            escrow: {
                publicID: escrow.publicID,
                status: ESCROW_STATUS.COMPLETED
            }
        }
    };
};