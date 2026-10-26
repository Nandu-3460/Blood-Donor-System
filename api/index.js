const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus, getDBError } = require('../server/config/db');
const errorHandler = require('../server/middleware/errorHandler');

// Load environment variables (Vercel provides them through process.env automatically)
dotenv.config();

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (always accessible, delivers real-time DB diagnostics)
app.get('/api/health', async (req, res) => {
  let isConnected = getDBStatus();
  if (!isConnected) {
    try {
      isConnected = await connectDB();
    } catch (e) {
      // Handled and captured in getDBError()
    }
  }

  const hasMongoUri = Boolean(
    process.env.MONGODB_URI &&
      process.env.MONGODB_URI.trim() !== '' &&
      !process.env.MONGODB_URI.includes('YOUR_USERNAME')
  );
  const hasJwtSecret = Boolean(
    process.env.JWT_SECRET && process.env.JWT_SECRET.trim() !== ''
  );
  const dbError = getDBError();

  res.status(200).json({
    status: 'online',
    databaseConnected: isConnected,
    timestamp: new Date().toISOString(),
    environment: 'vercel-serverless',
    diagnostics: {
      hasMongoUri,
      hasJwtSecret,
      lastError: dbError,
    },
    message: isConnected
      ? 'Blood Donor Finder API and MongoDB Atlas are fully operational on Vercel.'
      : dbError || 'MongoDB is not connected. Check MONGODB_URI and Atlas Network Access.',
  });
});

// Middleware to ensure database connection is ready for functional API routes
app.use(async (req, res, next) => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      const err = getDBError() || 'MongoDB Atlas connection is unavailable.';
      return res.status(503).json({
        success: false,
        message: `Database error: ${err}`,
        resolution:
          'Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access, and MONGODB_URI is configured in Vercel Project Environment Variables.',
      });
    }
    next();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: `Database error: ${getDBError() || err.message}`,
    });
  }
});

// API Routes
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/donors', require('../server/routes/donorRoutes'));
app.use('/api/requests', require('../server/routes/requestRoutes'));
app.use('/api/dashboard', require('../server/routes/dashboardRoutes'));

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;

