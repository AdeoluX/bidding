const server = require('./app');
const PORT = process.env.PORT || 5110;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server is running`);
});
