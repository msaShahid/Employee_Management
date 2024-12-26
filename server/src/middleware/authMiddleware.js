const jwt = require('jsonwebtoken');
const user = require("../models/userSchema");

const authenticate = (req, res, next) => {
  // let token = req.cookies && req.cookies.authToken;
  // console.log('Received token from  cookies:', token); 
  // if (!token) {
  //   token = req.session && req.session.authToken;
  //   console.log('Received token from session:', token); 
  // }
  // const token = sessionStorage.getItem('authToken');
  // console.log('Received token from session shahid :', token);
  // if (!token) {
  //   console.error('No token found in cookies or session');
  //   return res.status(401).json({ message: 'Not authenticated' });
  // }

  try {

    let userToken = token;
    // if (token.startsWith('Bearer ')) {
    //   userToken = token.split(' ')[1]; 
    // }
    userToken = token.split(' ')[1];
    if (!userToken) {
      throw new Error('Token format is invalid');
    }

    const jwtVerified = jwt.verify(userToken, process.env.JWT_SECRET);
   // console.log('Token verified:', jwtVerified);

    if (jwtVerified) {
        req.user = jwtVerified;
       // console.log("Authenticated user: ", req.user);
        next();
    } else {
        throw new Error('Error in the token');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


module.exports = { authenticate };