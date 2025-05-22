const catchAsync = require('../utils/catchAsync');
const { BidService } = require('../services/bid.service');
const { successResponse } = require('../utils/responder');

class BidController {
    static createBid = catchAsync(async (req, res, next) => {
        const { itemId } = req.params;
        const { amount } = req.body;
        const bidderId = req.user.id;
        const io = req.app.get('io');

        const bid = await BidService.createBid({
            itemId,
            bidderId,
            amount,
            io
        });

        return successResponse(req, res, bid, 'Bid placed successfully');
    });
}

module.exports = {
    BidController
}; 