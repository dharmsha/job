'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { createUserProfile, getUserProfile } from '@/lib/firebase-helpers';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Get additional user data from Firestore
        try {
          const result = await getUserProfile(firebaseUser.uid);
          if (result.success) {
            setUserData(result.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email/password
  const signup = async (email, password, userInfo) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: userInfo.name
      });
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Create user profile in Firestore
      const userProfileData = {
        uid: userCredential.user.uid,
        email: email,
        name: userInfo.name,
        userType: userInfo.userType,
        phone: userInfo.phone || '',
        location: userInfo.location || '',
        skills: userInfo.skills || [],
        bio: userInfo.bio || '',
        photoURL: userInfo.photoURL || '',
        subscription: 'free',
        emailVerified: false
      };
      
      await createUserProfile(userCredential.user.uid, userProfileData);
      
      // Update local state
      setUser(userCredential.user);
      setUserData(userProfileData);
      
      toast.success('Account created successfully! Please check your email for verification.');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const result = await getUserProfile(userCredential.user.uid);
      if (result.success) {
        setUserData(result.data);
      }
      
      toast.success('Login successful!');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Google Sign In
  const googleSignIn = async (userType = 'job_seeker') => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const existingUser = await getUserProfile(result.user.uid);
      
      if (!existingUser.success) {
        // First time user - create profile
        const userProfileData = {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          userType: userType,
          photoURL: result.user.photoURL,
          subscription: 'free',
          emailVerified: result.user.emailVerified
        };
        
        await createUserProfile(result.user.uid, userProfileData);
        setUserData(userProfileData);
      } else {
        setUserData(existingUser.data);
      }
      
      toast.success('Signed in with Google!');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      toast.success('Logged out successfully!');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateUser = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ...userData, ...updates }, { merge: true });
      
      // Update local state
      setUserData({ ...userData, ...updates });
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    googleSignIn,
    logout,
    forgotPassword,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}