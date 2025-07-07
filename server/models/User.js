const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
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
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

class UserService {
  static async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }
  
  static async create(userData) {
    const user = new User(userData);
    return await user.save();
  }
  
  static async findById(id) {
    return await User.findById(id);
  }
  
  static async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  static async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }
  
  static async findAll() {
    return await User.find({}).select('-password');
  }
}

module.exports = { User, UserService }; 