const { abortIf } = require('../utils/responder');
const httpStatus = require('http-status');
const bidRepository = require('../repo/bid.repo');
const itemRepository = require('../repo/item.repo');
const userRepository = require('../repo/user.repo');
const { ItemService } = require('./item.service');
const { SocketService } = require('./socket.service');

class BidService {
    static createBid = async ({ itemId, bidderId, amount, io }) => {
        // Get the item with its current version
        const item = await itemRepository.findById(itemId);
        abortIf(!item, httpStatus.NOT_FOUND, 'Item not found');
        
        // Check if item is active
        abortIf(item.status !== 'active', httpStatus.BAD_REQUEST, 'Item is not active');
        
        // Check if auction has ended
        const now = new Date();
        abortIf(new Date(item.endTime) <= now, httpStatus.BAD_REQUEST, 'Auction has ended');

        // Get the bidder
        const bidder = await userRepository.findById(bidderId);
        abortIf(!bidder, httpStatus.NOT_FOUND, 'Bidder not found');

        // Check if bidder's TIN is verified
        abortIf(!bidder.isTinVerified, httpStatus.FORBIDDEN, 'TIN verification required to place bids');
        abortIf(bidder.tinVerificationStatus !== 'verified', httpStatus.FORBIDDEN, 'TIN verification pending or rejected');

        // Check if bidder is not the seller
        abortIf(item.seller.toString() === bidderId, httpStatus.BAD_REQUEST, 'Cannot bid on your own item');

        // Check if bid amount is higher than current price
        abortIf(amount <= item.currentPrice, httpStatus.BAD_REQUEST, 'Bid amount must be higher than current price');

        // Create the bid
        const bid = await bidRepository.create({
            item: itemId,
            bidder: bidderId,
            amount
        });

        try {
            // Update item's current price with optimistic locking
            const updatedItem = await ItemService.updateCurrentPrice(itemId, amount, item.version);
            
            // Notify all connected clients about the new bid
            if (io) {
                SocketService.notifyNewBid(io, itemId, bid);
            }

            // Check if this bid ends the auction (if it's the last possible bid)
            if (new Date(item.endTime) - now <= 1000) { // Less than 1 second remaining
                SocketService.notifyAuctionEnd(io, itemId, amount, bidderId);
            }

            return bid;
        } catch (error) {
            // If update fails, delete the bid and throw error
            await bidRepository.delete(bid._id);
            throw error;
        }
    };
}

module.exports = {
    BidService
}; 