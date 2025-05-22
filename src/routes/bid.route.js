const express = require('express');
const { BidController } = require('../controller/bid.controller');
const { validateReq } = require('../middleware/validate');
const { createBidSchema } = require('../validations/bid.validations');
const Authorization = require('../utils/authorization.service');
const { checkTinVerification } = require('../middleware/tinVerification');

const router = express.Router();
const BASE = '/items';

// Place a bid on an item
router.post(
    `${BASE}/:itemId/bids`,
    Authorization.authenticateToken,
    checkTinVerification,
    validateReq(createBidSchema),
    BidController.createBid
);

module.exports = router; 