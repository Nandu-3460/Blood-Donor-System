const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('../server/config/db');
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

// Middleware to ensure database connection is ready for each serverless invocation
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in serverless function:', err.message);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    databaseConnected: getDBStatus(),
    timestamp: new Date().toISOString(),
    environment: 'vercel-serverless',
    message: 'Blood Donor Finder API and MongoDB are fully operational on Vercel.',
  });
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
