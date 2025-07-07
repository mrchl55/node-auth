const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getConnection } = require('../config/database');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const MongoUser = mongoose.model('User', userSchema);

class MySQLUser {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.id = data.id;
  }

  static async create(userData) {
    const connection = getConnection();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [userData.email, hashedPassword]
      );
      
      return new MySQLUser({
        id: result.insertId,
        email: userData.email,
        password: hashedPassword
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('email already exists');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) return null;
    
    return new MySQLUser(rows[0]);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;
    
    return new MySQLUser(rows[0]);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class FileUser {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.id = data.id || Date.now().toString();
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static async ensureDataDir() {
    const dataDir = path.dirname(USERS_FILE);
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  static async loadUsers() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async saveUsers(users) {
    await this.ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  static async create(userData) {
    const users = await this.loadUsers();
    
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = new FileUser({
      email: userData.email,
      password: hashedPassword,
      id: Date.now().toString()
    });

    users.push(newUser);
    await this.saveUsers(users);
    
    return newUser;
  }

  static async findByEmail(email) {
    const users = await this.loadUsers();
    const userData = users.find(u => u.email === email);
    
    if (!userData) return null;
    
    return new FileUser(userData);
  }

  static async findById(id) {
    const users = await this.loadUsers();
    const userData = users.find(u => u.id === id);
    
    if (!userData) return null;
    
    return new FileUser(userData);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

const getUser = () => {
  const dbType = process.env.DB_TYPE || 'mysql';
  
  if (dbType === 'mongodb') {
    return MongoUser;
  } else if (dbType === 'mysql') {
    return MySQLUser;
  } else if (dbType === 'file') {
    return FileUser;
  }
  
  return FileUser;
};

module.exports = getUser(); 