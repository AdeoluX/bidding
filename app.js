require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.config');

const ApiError = require('./src/utils/ApiError');
const httpStatus = require('http-status');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { authRoute, utilsRoute, webHookRoute, itemRoute, bidRoute } = require('./src/routes');
const { errorConverter, errorHandler } = require('./src/middleware/error');
const fileUpload = require("express-fileupload");
const { SocketService } = require('./src/services/socket.service');

const dbConnect = require('./src/config/db.config');
const server = require('http').createServer(app);
const io = SocketService.initialize(server);

// Make io available to routes
app.set('io', io);

const corsOptions = {
  origin: '*', // Update this for production
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  abortOnLimit: true
}));

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Routes
app.use('/api/v1', authRoute);
app.use('/api/v1', utilsRoute);
app.use('/api/v1', webHookRoute);
app.use('/api/v1/items', itemRoute);
app.use('/api/v1/bids', bidRoute);

// Catch-all for 404 errors
app.use((req, res, next) => {
  console.log(`Endpoint not found: ${req.method} ${req.originalUrl}`);
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found', true));
});

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

// Connect to database
dbConnect.then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Failed to connect to database:', error.message);
  process.exit(1);
});

// Export server instead of app for WebSocket support
module.exports = server;