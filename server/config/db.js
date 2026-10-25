const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for Vercel serverless functions)
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('YOUR_USERNAME')) {
    console.warn('\n=============================================================');
    console.warn('⚠️  MONGODB_URI is not configured in server/.env!');
    console.warn('The server is running, but database operations will fail until');
    console.warn('you provide a valid MongoDB Atlas connection string.');
    console.warn('👉 Refer to README.md for the step-by-step Atlas setup guide.');
    console.warn('=============================================================\n');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`\n✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}\n`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error('\n=============================================================');
    console.error('❌ MongoDB Connection Error:', error.message);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('👉 Diagnosis: Database username or password in MONGODB_URI is incorrect.');
    } else if (error.message.includes('timed out') || error.message.includes('ETIMEDOUT') || error.message.includes('queryTxt ETIMEOUT')) {
      console.error('👉 Diagnosis: Connection timed out. Ensure Network Access in MongoDB Atlas has 0.0.0.0/0 allowed.');
    } else if (error.message.includes('Invalid connection string')) {
      console.error('👉 Diagnosis: Connection string format is invalid. Ensure it begins with mongodb+srv://');
    }
    console.error('=============================================================\n');
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
