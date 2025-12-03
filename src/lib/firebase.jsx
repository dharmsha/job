// src/lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3BfKa2IDbBYiCWpiwUw7me_G0a5VOT_s",
  authDomain: "attendence-tracker-90940.firebaseapp.com",
  projectId: "attendence-tracker-90940",
  storageBucket: "attendence-tracker-90940.firebasestorage.app",
  messagingSenderId: "575531776559",
  appId: "1:575531776559:web:fb14ef4839e1a79fa564da",
  measurementId: "G-BDEPT9DS5C"
};

// Initialize Firebase only on client side and only once
let firebaseApp;
let auth;
let db;
let storage;
let analytics;

// Check if we're running in browser (not on server)
if (typeof window !== 'undefined') {
  // Check if Firebase app already initialized
  if (!getApps().length) {
    try {
      console.log('🚀 Initializing Firebase...');
      firebaseApp = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized successfully');
      
      // Initialize services
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
      storage = getStorage(firebaseApp);
      analytics = getAnalytics(firebaseApp);
      
      console.log('✅ Firebase services initialized');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
    }
  } else {
    // Use existing app
    firebaseApp = getApps()[0];
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    analytics = getAnalytics(firebaseApp);
    console.log('✅ Using existing Firebase app');
  }
} else {
  console.log('⚠️ Firebase not initialized (server-side rendering)');
  // Create dummy objects for server-side to avoid undefined errors
  auth = null;
  db = null;
  storage = null;
  analytics = null;
}

// Export the Firebase services
export { auth, db, storage, analytics };
export default firebaseApp;