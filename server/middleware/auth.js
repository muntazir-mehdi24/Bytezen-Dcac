import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    let user;
    
    try {
      // Try to verify as JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token - support both _id and uid
      if (decoded.id) {
        user = await User.findById(decoded.id).select('-password');
      } else if (decoded.uid) {
        user = await User.findOne({ uid: decoded.uid }).select('-password');
      }
    } catch (jwtError) {
      // JWT verification failed - might be a Firebase token
      console.log('JWT verification failed:', jwtError.message);
      
      // In development mode, create a mock user for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Using development mode - creating mock user');
        user = {
          _id: 'dev-user-id',
          uid: 'dev-firebase-uid',
          email: 'dev@bytezen.com',
          name: 'Development User',
          role: 'student',
          toObject: function() { return this; }
        };
      }
    }
    
    if (!user) {
      console.log('No user found after token verification');
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: err.message
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
