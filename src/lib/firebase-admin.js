// src/lib/firebase-admin.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Environment variables se configuration
const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

// Initialize
let adminApp;
let adminAuth;
let adminDb;

if (!getApps().length) {
  adminApp = initializeApp(adminConfig);
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} else {
  adminApp = getApps()[0];
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
}

export { adminAuth, adminDb };
export default adminApp;