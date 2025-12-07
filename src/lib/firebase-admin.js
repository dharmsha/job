// lib/firebase-admin.js
import * as admin from 'firebase-admin';

let adminAuth = null;
let adminDb = null;

if (typeof window === 'undefined') {
  // Server-side only
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin SDK initialized');
    }
    
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('⚠️ Ensure FIREBASE environment variables are set in Vercel');
  }
} else {
  console.log('ℹ️ Firebase Admin SDK not initialized (client-side)');
}

export { adminAuth, adminDb };