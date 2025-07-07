const jwt = require('jsonwebtoken');
const { UserService } = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'user not found' });
    }

    req.user = { userId: decoded.userId, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'invalid token' });
  }
};

module.exports = {
  authenticateToken
}; 