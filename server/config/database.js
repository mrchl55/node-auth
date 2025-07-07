const mongoose = require('mongoose');

// MongoDB connection using Mongoose
async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/node-auth';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// MySQL connection (keeping as fallback)
async function connectMySQL() {
  const mysql = require('mysql2/promise');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'node_auth',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to MySQL');
    return connection;
  } catch (error) {
    console.error('MySQL connection error:', error);
    throw error;
  }
}

// Main database connection function
async function connectDatabase() {
  const dbType = process.env.DB_TYPE || 'mongodb';
  
  if (dbType === 'mongodb') {
    return await connectMongoDB();
  } else if (dbType === 'mysql') {
    return await connectMySQL();
  } else {
    throw new Error(`Unsupported database type: ${dbType}`);
  }
}

module.exports = { connectDatabase }; 