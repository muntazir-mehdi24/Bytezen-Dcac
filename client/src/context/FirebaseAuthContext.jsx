import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGcZtrzx8iukmjsCF9Ikf2gWY8UR9bcOQ",
  authDomain: "bytezen-3a7d0.firebaseapp.com",
  projectId: "bytezen-3a7d0",
  storageBucket: "bytezen-3a7d0.firebasestorage.app",
  messagingSenderId: "1023451285245",
  appId: "1:1023451285245:web:cf701527c2afe38806e094",
  measurementId: "G-QTRRZSRHLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load user profile from Firestore
  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Create default profile
        const newProfile = {
          userId: uid,
          name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
          email: auth.currentUser.email,
          role: 'student',
          enrolledCourses: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with Email/Password
  const login = async (email, password) => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register with Email/Password
  const register = async (userData) => {
    try {
      setError('');
      const { email, password, name } = userData;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', uid), {
        userId: uid,
        name: name || email.split('@')[0],
        email: email,
        role: 'student',
        enrolledCourses: [],
        createdAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(doc(db, 'users', uid), {
          userId: uid,
          name: result.user.displayName,
          email: result.user.email,
          role: 'student',
          enrolledCourses: [],
          createdAt: new Date().toISOString()
        });
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset email.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update User Profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };
      
      await updateDoc(doc(db, 'users', user.uid), updates);
      setUserProfile({ ...userProfile, ...updates });
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile.';
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
