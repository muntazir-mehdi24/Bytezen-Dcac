import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    // Try to use service account JSON first
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with service account JSON');
    } 
    // Fallback to individual credentials
    else if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || "bytezen-3a7d0",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      console.log('Firebase Admin initialized with individual credentials');
    } else {
      console.log('No Firebase credentials found - Firebase features will be limited');
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
      
      // If user doesn't exist in MongoDB, fetch from Firestore
      if (!user) {
        console.log('User not found in MongoDB, fetching from Firestore');
        try {
          const db = admin.firestore();
          const userDoc = await db.collection('users').doc(firebaseUid).get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            user = {
              _id: firebaseUid,
              uid: firebaseUid,
              email: userData.email || decodedToken.email,
              name: userData.name || decodedToken.name || decodedToken.email?.split('@')[0],
              role: userData.role || 'student',
              toObject: function() { return this; }
            };
            console.log('User loaded from Firestore with role:', user.role);
          } else {
            // User doesn't exist in Firestore either, create default
            user = {
              _id: firebaseUid,
              uid: firebaseUid,
              email: decodedToken.email,
              name: decodedToken.name || decodedToken.email?.split('@')[0],
              role: 'student',
              toObject: function() { return this; }
            };
          }
        } catch (firestoreError) {
          console.log('Firestore fetch error:', firestoreError.message);
          // Fallback to basic user object
          user = {
            _id: firebaseUid,
            uid: firebaseUid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email?.split('@')[0],
            role: 'student',
            toObject: function() { return this; }
          };
        }
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
