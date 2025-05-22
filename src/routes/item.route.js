const express = require('express');
const { ItemController } = require('../controller/item.controller');
const { validateReq } = require('../middleware/validate');
const { createItemSchema, getActiveItemsSchema } = require('../validations/item.validations');
const Authorization = require('../utils/authorization.service');
const { checkTinVerification } = require('../middleware/tinVerification');

const router = express.Router();
const BASE = '/items';

// Create a new item listing (as draft)
router.post(
    BASE,
    Authorization.authenticateToken,
    checkTinVerification,
    validateReq(createItemSchema),
    ItemController.createItem
);

// Publish a draft item
router.post(
    `${BASE}/:itemId/publish`,
    Authorization.authenticateToken,
    checkTinVerification,
    ItemController.publishItem
);

// Get all active items
router.get(
    BASE,
    validateReq(getActiveItemsSchema),
    ItemController.getActiveItems
);

module.exports = router; 