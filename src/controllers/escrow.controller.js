// Catch Async
const catchAsync = require('../utils/catch-async');

// Services
const escrowService = require('../services/escrow.service')

// Create
exports.create = catchAsync(async (req, res) => {
    const result = await escrowService.create(req.user, req.body);
    res.status(201).json(result.response);
});

// Escrows
exports.escrows = catchAsync(async (req, res) => {
    const result = await escrowService.escrows(req.user);
    res.status(200).json(result.response);
});

// Escrow
exports.escrow = catchAsync(async (req, res) => {
    const result = await escrowService.escrow(req.user, req.params);
    res.status(200).json(result.response);
});

// Respond
exports.respond = catchAsync(async (req, res) => {
    const result = await escrowService.respond(req.user, req.params, req.body);
    res.status(200).json(result.response);
});

// Release
exports.release = catchAsync(async (req, res) => {
    const result = await escrowService.release(req.user, req.params);
    res.status(200).json(result.response);
});

// Withdraw
exports.withdraw = catchAsync(async (req, res) => {
    const result = await escrowService.withdraw(req.user, req.params, req.body);
    res.status(200).json(result.response);
});