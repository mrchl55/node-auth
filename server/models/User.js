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

const getUser = () => {
  const dbType = process.env.DB_TYPE || 'mysql';
  return dbType === 'mongodb' ? MongoUser : MySQLUser;
};

module.exports = getUser(); 