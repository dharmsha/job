import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on client side and only once
let firebaseApp;
let auth;
let db;
let storage;
let analytics;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    try {
      console.log('🚀 Initializing Firebase...');
      firebaseApp = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized successfully');
     
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
      storage = getStorage(firebaseApp);
     
      // Analytics only in production (and if measurementId exists)
      if (firebaseConfig.measurementId && process.env.NODE_ENV === 'production') {
        analytics = getAnalytics(firebaseApp);
      }
     
      console.log('✅ Firebase services initialized');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
    }
  } else {
    firebaseApp = getApps()[0];
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    console.log('✅ Using existing Firebase app');
  }
} else {
  console.log('⚠️ Firebase not initialized (server-side rendering)');
  auth = null;
  db = null;
  storage = null;
  analytics = null;
}

export { auth, db, storage, analytics };
export default firebaseApp;