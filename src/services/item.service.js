const { abortIf } = require('../utils/responder');
const httpStatus = require('http-status');
const itemRepository = require('../repo/item.repo');
const { uploadMultipleImages } = require('../utils/cloudinary');

class ItemService {
    static createItem = async ({ title, description, startingPrice, endTime, seller, images, tags }) => {
        // Validate end time is in the future
        const now = new Date();
        abortIf(new Date(endTime) <= now, httpStatus.BAD_REQUEST, 'End time must be in the future');

        // Upload images to cloud storage
        const uploadedImages = await uploadMultipleImages(images);

        const item = await itemRepository.create({
            title,
            description,
            startingPrice,
            currentPrice: startingPrice, // Initialize current price as starting price
            endTime,
            seller,
            status: 'draft', // Start as draft
            images: uploadedImages,
            tags: tags.map(tag => tag.toLowerCase().trim())
        });

        return item;
    };

    static publishItem = async (itemId, sellerId) => {
        const item = await itemRepository.findOne({
            query: { _id: itemId, seller: sellerId }
        });
        
        abortIf(!item, httpStatus.NOT_FOUND, 'Item not found');
        abortIf(item.status !== 'draft', httpStatus.BAD_REQUEST, 'Only draft items can be published');
        
        const now = new Date();
        abortIf(new Date(item.endTime) <= now, httpStatus.BAD_REQUEST, 'End time must be in the future');

        const updatedItem = await itemRepository.update(itemId, {
            status: 'active',
            version: item.version + 1
        });

        return updatedItem;
    };

    static getActiveItems = async (query = {}, sort = {}) => {
        const now = new Date();
        const activeItems = await itemRepository.findAll({
            query: {
                status: 'active',
                endTime: { $gt: now },
                ...query
            },
            populate: {
                path: 'seller',
                select: 'firstname lastname email'
            },
            sort
        });

        return activeItems;
    };

    static updateCurrentPrice = async (itemId, newPrice, currentVersion) => {
        // Use findOneAndUpdate with optimistic locking
        const updatedItem = await itemRepository.findOneAndUpdate(
            {
                _id: itemId,
                version: currentVersion,
                status: 'active',
                endTime: { $gt: new Date() }
            },
            {
                $set: { currentPrice: newPrice },
                $inc: { version: 1 }
            },
            { new: true }
        );

        abortIf(!updatedItem, httpStatus.CONFLICT, 'Item was modified by another user. Please try again.');

        return updatedItem;
    };
}

module.exports = {
    ItemService
}; 