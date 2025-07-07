const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

let mysqlConnection = null;
let mongoConnection = null;

const connectMySQL = async () => {
  try {
    mysqlConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

    await mysqlConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('mysql connected');
    return mysqlConnection;
  } catch (error) {
    console.error('mysql connection failed:', error);
    throw error;
  }
};

const connectMongoDB = async () => {
  try {
    mongoConnection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/node_auth');
    console.log('mongodb connected');
    return mongoConnection;
  } catch (error) {
    console.error('mongodb connection failed:', error);
    throw error;
  }
};

const connectDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'mysql';
  
  if (dbType === 'mysql') {
    return await connectMySQL();
  } else if (dbType === 'mongodb') {
    return await connectMongoDB();
  } else if (dbType === 'file') {
    console.log('using file-based storage');
    return Promise.resolve();
  } else {
    console.log('no database specified, using file-based storage');
    return Promise.resolve();
  }
};

const getConnection = () => {
  const dbType = process.env.DB_TYPE || 'mysql';
  
  if (dbType === 'mysql') {
    return mysqlConnection;
  } else if (dbType === 'mongodb') {
    return mongoConnection;
  }
  
  return null;
};

module.exports = {
  connectDatabase,
  getConnection
}; 