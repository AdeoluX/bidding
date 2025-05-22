const socketIO = require('socket.io');

class SocketService {
    static initialize(server) {
        const io = socketIO(server);

        io.on('connection', (socket) => {
            console.log('Client connected');

            // Join item room
            socket.on('joinItem', (itemId) => {
                socket.join(`item_${itemId}`);
            });

            // Leave item room
            socket.on('leaveItem', (itemId) => {
                socket.leave(`item_${itemId}`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

        return io;
    }

    static notifyNewBid(io, itemId, bid) {
        io.to(`item_${itemId}`).emit('newBid', {
            bidId: bid._id,
            amount: bid.amount,
            bidder: bid.bidder,
            timestamp: bid.createdAt
        });
    }

    static notifyAuctionEnd(io, itemId, finalPrice, winner) {
        io.to(`item_${itemId}`).emit('auctionEnd', {
            itemId,
            finalPrice,
            winner
        });
    }
}

module.exports = {
    SocketService
}; 