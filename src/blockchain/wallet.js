/**
 * Wallet
 * A dedicated escrow wallet, in the shape stored on the escrow document.
 *
 * @typedef {Object} Wallet
 * @property {string} publicKey Base58 address the sender deposits into.
 * @property {string} encryptedPrivateKey Base64 secret key, encrypted with AES-256-GCM by `security/encryption`.
 */

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

/**
 * Connection
 * The single RPC connection shared by every wallet call, reading and confirming at `confirmed` commitment.
 *
 * @type {Connection}
 */
const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');

/**
 * To Lamports
 * Converts SOL to lamports (1 SOL = 1,000,000,000 lamports), rounding to the nearest lamport.
 *
 * @param {number} sol Amount in SOL.
 * @returns {number} Whole number of lamports.
 */
exports.toLamports = (sol) => Math.round(sol * LAMPORTS_PER_SOL);

/**
 * To SOL
 * Converts lamports to SOL, for display and for comparing with amounts stored in SOL.
 *
 * @param {number} lamports Whole number of lamports.
 * @returns {number} Amount in SOL.
 */
exports.toSol = (lamports) => lamports / LAMPORTS_PER_SOL;

/**
 * To Keypair
 * Decrypts a stored secret key and rebuilds the signing keypair. Private so decrypted keys never leave this module.
 *
 * @param {string} encryptedPrivateKey Encrypted secret key, as stored on the escrow.
 * @returns {Keypair} Keypair that signs for the escrow wallet.
 * @private
 */
const toKeypair = (encryptedPrivateKey) => {
    return Keypair.fromSecretKey(Buffer.from(encryption.decrypt(encryptedPrivateKey), 'base64'));
};

/**
 * Create Wallet
 * Generates a fresh keypair for one escrow and returns only the encrypted secret key, so the plaintext key never outlives this call.
 *
 * @returns {Wallet} Public address and encrypted secret key, ready to store.
 */
exports.create = () => {

    const keypair = Keypair.generate();

    return {
        publicKey: keypair.publicKey.toBase58(),
        encryptedPrivateKey: encryption.encrypt(Buffer.from(keypair.secretKey).toString('base64'))
    };
};

/**
 * Get Balance
 * Reads a wallet's current balance from the chain.
 *
 * @param {string} publicKey Base58 wallet address.
 * @returns {Promise<number>} Balance in lamports.
 */
exports.getBalance = (publicKey) => {
    return connection.getBalance(new PublicKey(publicKey));
};

/**
 * Subscribe
 * Calls the handler with the new balance whenever the wallet changes, over the RPC websocket. Handler errors are logged and swallowed, and the subscription ends when the process stops.
 *
 * @param {string} publicKey Base58 wallet address.
 * @param {(lamports: number) => (void | Promise<void>)} onBalanceChange Called with the new balance in lamports.
 * @returns {number} Subscription ID, to pass to `unsubscribe`.
 */
exports.subscribe = (publicKey, onBalanceChange) => {
    return connection.onAccountChange(new PublicKey(publicKey), async (accountInfo) => {
        try {
            await onBalanceChange(accountInfo.lamports);
        } catch (error) {
            console.error(`[WALLET] Balance handler failed for ${publicKey}:`, error);
        }
    });
};

/**
 * Unsubscribe
 * Stops a balance subscription started by `subscribe`.
 *
 * @param {number} subscriptionID Subscription ID returned by `subscribe`.
 * @returns {Promise<void>} Resolves once the subscription is removed.
 */
exports.unsubscribe = (subscriptionID) => {
    return connection.removeAccountChangeListener(subscriptionID);
};

/**
 * Transfer
 * Sends the wallet's entire balance minus the network fee to the destination, leaving the escrow wallet empty, so the receiver pays the fee.
 *
 * @param {string} encryptedPrivateKey Encrypted secret key of the escrow wallet, as stored on the escrow.
 * @param {string} destination Base58 address receiving the funds.
 * @returns {Promise<string>} Signature of the confirmed transaction.
 * @throws {Error} If the fee can't be estimated, the balance doesn't cover it, or the transaction doesn't confirm.
 */
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