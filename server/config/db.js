const mongoose = require('mongoose');

// Cache connection across serverless invocations in global scope
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastError: null };
}

const connectDB = async () => {
  // If already connected, reuse existing connection (vital for Vercel serverless)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('YOUR_USERNAME')) {
    const missingMsg = 'MONGODB_URI environment variable is missing or contains placeholder credentials.';
    cached.lastError = missingMsg;
    console.warn('\n=============================================================');
    console.warn('⚠️  ' + missingMsg);
    console.warn('The server is running, but database operations will fail.');
    console.warn('👉 In Vercel: Add MONGODB_URI to Project Settings > Environment Variables.');
    console.warn('=============================================================\n');
    return false;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents queries from buffering indefinitely when disconnected
      serverSelectionTimeoutMS: 5000, // Fail fast so serverless functions don't timeout
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        cached.lastError = null;
        console.log(`\n✅ MongoDB Connected successfully to host: ${mongooseInstance.connection.host}`);
        console.log(`📦 Database Name: ${mongooseInstance.connection.name}\n`);
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;

        let friendlyMsg = error.message;
        if (
          error.message.includes('tlsv1 alert internal error') ||
          error.message.includes('SSL alert number 80') ||
          error.message.includes('Could not connect to any servers') ||
          error.message.includes('ReplicaSetNoPrimary')
        ) {
          friendlyMsg =
            'MongoDB Atlas rejected connection. Please ensure Network Access has 0.0.0.0/0 (Allow Access from Anywhere) enabled in MongoDB Atlas.';
        } else if (
          error.message.includes('bad auth') ||
          error.message.includes('Authentication failed')
        ) {
          friendlyMsg =
            'MongoDB Atlas authentication failed. Ensure the username and password in MONGODB_URI are correct.';
        } else if (error.message.includes('Invalid connection string')) {
          friendlyMsg =
            'Invalid MongoDB connection string. Must start with mongodb+srv:// or mongodb://.';
        }

        cached.lastError = friendlyMsg;
        console.error('\n=============================================================');
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('👉 Diagnosis:', friendlyMsg);
        console.error('=============================================================\n');
        throw error;
      });
  }

  try {
    await cached.promise;
    return true;
  } catch (error) {
    return false;
  }
};

const getDBStatus = () => Boolean(cached && cached.conn && mongoose.connection.readyState === 1);
const getDBError = () => (cached ? cached.lastError : null);

module.exports = { connectDB, getDBStatus, getDBError };
