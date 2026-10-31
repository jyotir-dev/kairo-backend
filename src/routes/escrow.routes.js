// Dependencies
const express = require('express');

// Express Router
const router = express.Router();

// Limits
const escrowLimits = require('../limits/escrow.limits');

// Validators
const escrowValidator = require('../validators/escrow.validator');

// Controllers
const escrowController = require('../controllers/escrow.controller');

// Middlewares
const requireAuth = require('../middlewares/auth.middleware');
const rateLimit = require('../middlewares/ratelimit.middleware');
const validateRequest = require('../middlewares/validate.middleware');

// Escrow Routes
router.post(
    '/create', 
    rateLimit(escrowLimits.create),
    requireAuth,
    validateRequest(escrowValidator.create), 
    escrowController.create
);

router.get('/escrows',
    requireAuth, 
    escrowController.escrows
);

router.get(
    '/:publicID',
    requireAuth,
    validateRequest(escrowValidator.publicID),
    escrowController.escrow
);

router.patch(
    '/:publicID/respond',
    rateLimit(escrowLimits.respond),
    requireAuth,
    validateRequest(escrowValidator.respond),
    escrowController.respond
);

router.patch(
    '/:publicID/release',
    rateLimit(escrowLimits.payout),
    requireAuth,
    validateRequest(escrowValidator.release),
    escrowController.release
);

router.patch(
    '/:publicID/withdraw',
    rateLimit(escrowLimits.payout),
    requireAuth, 
    validateRequest(escrowValidator.withdraw),
    escrowController.withdraw
);

// Export Router
module.exports = router;