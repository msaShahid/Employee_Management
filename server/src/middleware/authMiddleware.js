const jwt = require('jsonwebtoken');
const user = require("../models/userSchema");

const authenticate = (req, res, next) => {
  try {
    let token = req.cookies.authToken || req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authentication failed.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Authentication error:', error);
      return res.status(500).json({ message: 'Server error during authentication' });
    }
  }
};

module.exports = { authenticate };
