// Dependencies
const {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
} = require('@solana/web3.js');

// Security
const encryption = require('../security/encryption');

// Connection
const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');

// To Lamports
exports.toLamports = (sol) => Math.round(sol * LAMPORTS_PER_SOL);

// To SOL
exports.toSol = (lamports) => lamports / LAMPORTS_PER_SOL;

// To Keypair
const toKeypair = (encryptedPrivateKey) => {
    return Keypair.fromSecretKey(Buffer.from(encryption.decrypt(encryptedPrivateKey), 'base64'));
};

// Create Wallet
exports.create = () => {

    const keypair = Keypair.generate();

    return {
        publicKey: keypair.publicKey.toBase58(),
        encryptedPrivateKey: encryption.encrypt(Buffer.from(keypair.secretKey).toString('base64'))
    };
};

// Get Balance
exports.getBalance = (publicKey) => {
    return connection.getBalance(new PublicKey(publicKey));
};

// Subscribe
exports.subscribe = (publicKey, onBalanceChange) => {
    return connection.onAccountChange(new PublicKey(publicKey), async (accountInfo) => {
        try {
            await onBalanceChange(accountInfo.lamports);
        } catch (error) {
            console.error(`[WALLET] Balance handler failed for ${publicKey}:`, error);
        }
    });
};

// Unsubscribe
exports.unsubscribe = (subscriptionID) => {
    return connection.removeAccountChangeListener(subscriptionID);
};

// Transfer
exports.transfer = async (encryptedPrivateKey, destination) => {

    const sender = toKeypair(encryptedPrivateKey);
    const recipient = new PublicKey(destination);

    const [balance, { blockhash, lastValidBlockHeight }] = await Promise.all([
        connection.getBalance(sender.publicKey),
        connection.getLatestBlockhash()
    ]);

    const buildTransaction = (lamports) => {
        return new Transaction({ feePayer: sender.publicKey, blockhash, lastValidBlockHeight }).add(
            SystemProgram.transfer({
                fromPubkey: sender.publicKey,
                toPubkey: recipient,
                lamports
            })
        );
    };

    const { value: fee } = await connection.getFeeForMessage(buildTransaction(balance).compileMessage());

    if (fee === null) {
        throw new Error('Unable to estimate transaction fee.');
    }

    const lamports = balance - fee;

    if (lamports <= 0) {
        throw new Error('Insufficient balance to cover the transaction fee.');
    }

    return sendAndConfirmTransaction(connection, buildTransaction(lamports), [sender], {
        commitment: 'confirmed',
        maxRetries: 3
    });
};