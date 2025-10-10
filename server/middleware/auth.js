import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    // Check if we have Firebase credentials
    const hasCredentials = process.env.FIREBASE_PROJECT_ID && 
                          process.env.FIREBASE_CLIENT_EMAIL && 
                          process.env.FIREBASE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Format the private key properly - handle both escaped and unescaped newlines
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey && !privateKey.includes('\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      console.log('Firebase Admin initialized successfully');
    } else {
      console.log('Firebase credentials not found - Firebase auth will not work');
    }
  } catch (error) {
    console.log('Firebase admin initialization error:', error.message);
  }
}

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
    let firebaseUid;
    
    // Try Firebase token verification first
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      firebaseUid = decodedToken.uid;
      
      // Find user by Firebase UID
      user = await User.findOne({ uid: firebaseUid }).select('-password');
      
      // If user doesn't exist in MongoDB, create a basic user object from Firebase
      if (!user) {
        console.log('User not found in MongoDB, using Firebase data');
        user = {
          _id: firebaseUid,
          uid: firebaseUid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email?.split('@')[0],
          role: 'student',
          toObject: function() { return this; }
        };
      }
    } catch (firebaseError) {
      // Firebase verification failed, try JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from the token - support both _id and uid
        if (decoded.id) {
          user = await User.findById(decoded.id).select('-password');
        } else if (decoded.uid) {
          user = await User.findOne({ uid: decoded.uid }).select('-password');
        }
      } catch (jwtError) {
        console.log('Both Firebase and JWT verification failed');
      }
    }
    
    if (!user) {
      console.log('No user found after token verification');
      return res.status(401).json({
        success: false,
        error: 'User not found or invalid token'
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
