const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus, getDBError } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  const isConnected = getDBStatus();
  const dbError = getDBError();
  res.status(200).json({
    status: 'online',
    databaseConnected: isConnected,
    timestamp: new Date().toISOString(),
    diagnostics: {
      hasMongoUri: Boolean(process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_USERNAME')),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      lastError: dbError,
    },
    message: isConnected
      ? 'Blood Donor Finder API and MongoDB are fully operational.'
      : dbError || 'API is running, but MongoDB is not connected. Configure MONGODB_URI in server/.env.',
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start server
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`🚀 Blood Donor Finder Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=============================================================`);
  });
});
