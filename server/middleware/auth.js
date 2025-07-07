const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: 'access token required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
};

module.exports = {
  authenticateToken
}; 