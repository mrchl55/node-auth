const jwt = require('jsonwebtoken');
const { UserService } = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'email already exists' });
    }
    
    const user = await UserService.create({ email, password });
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'user created successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('registration error:', error);
    res.status(500).json({ message: 'server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'server error' });
  }
};

const profile = async (req, res) => {
  try {
    const user = await UserService.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('profile error:', error);
    res.status(500).json({ message: 'server error' });
  }
};

const verify = async (req, res) => {
  try {
    const user = await UserService.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    
    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('verify error:', error);
    res.status(500).json({ message: 'server error' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'logout successful' });
};

module.exports = {
  register,
  login,
  profile,
  verify,
  logout
}; 