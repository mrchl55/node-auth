const User = require('../models/User');
const { generateToken, verifyToken, extractTokenFromHeader } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'email already registered' });
    }

    const user = await User.create({ email, password });
    const token = generateToken({ id: user.id || user._id, email: user.email });

    res.status(201).json({
      message: 'user registered successfully',
      token,
      user: {
        id: user.id || user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const token = generateToken({ id: user.id || user._id, email: user.email });

    res.json({
      message: 'login successful',
      token,
      user: {
        id: user.id || user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'login failed' });
  }
};

const logout = async (req, res) => {
  res.json({ message: 'logout successful' });
};

const verify = async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: 'no token provided' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id || user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'invalid token' });
  }
};

const profile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id || req.user._id,
      email: req.user.email
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  verify,
  profile
}; 