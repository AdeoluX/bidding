const catchAsync = require('../utils/catchAsync');
const { ItemService } = require('../services');
const { successResponse } = require('../utils/responder');

class ItemController {
    static createItem = catchAsync(async (req, res, next) => {
        const { title, description, startingPrice, endTime, tags } = req.body;
        const sellerId = req.user.id; // Get seller ID from authenticated user
        const images = req.files.images; // Get uploaded images

        const item = await ItemService.createItem({
            title,
            description,
            startingPrice,
            endTime,
            seller: sellerId,
            images,
            tags
        });

        return successResponse(req, res, item, 'Item created successfully as draft');
    });

    static publishItem = catchAsync(async (req, res, next) => {
        const { itemId } = req.params;
        const sellerId = req.user.id;

        const item = await ItemService.publishItem(itemId, sellerId);
        return successResponse(req, res, item, 'Item published successfully');
    });

    static getActiveItems = catchAsync(async (req, res, next) => {
        const { 
            search, 
            minPrice, 
            maxPrice, 
            tags, 
            currentBid,
            sortBy = 'endTime',
            sortOrder = 'asc'
        } = req.query;
        
        // Build query object based on filters
        const query = {};
        
        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.currentPrice = {};
            if (minPrice) query.currentPrice.$gte = Number(minPrice);
            if (maxPrice) query.currentPrice.$lte = Number(maxPrice);
        }

        // Current bid range filter
        if (currentBid) {
            if (currentBid.min || currentBid.max) {
                query.currentPrice = query.currentPrice || {};
                if (currentBid.min) query.currentPrice.$gte = Number(currentBid.min);
                if (currentBid.max) query.currentPrice.$lte = Number(currentBid.max);
            }
        }

        // Tags filter
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            query.tags = { $in: tagArray.map(tag => tag.toLowerCase().trim()) };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const items = await ItemService.getActiveItems(query, sort);
        return successResponse(req, res, items, 'Active items retrieved successfully');
    });
}

module.exports = {
    ItemController
}; 