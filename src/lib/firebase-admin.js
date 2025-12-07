// Build-safe Firebase Admin initialization
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseAdmin = null;
let adminAuth = null;

// Function to safely initialize
const initFirebaseAdmin = () => {
  // Skip if window exists (client-side) or if building
  if (typeof window !== 'undefined' || 
      process.env.npm_lifecycle_event === 'build' ||
      !process.env.FIREBASE_PROJECT_ID) {
    console.log('Firebase Admin: Skipping initialization (build/client mode)');
    return;
  }
  
  try {
    // Check for required environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (!projectId || !clientEmail || !privateKey) {
      console.log('Firebase Admin: Missing environment variables');
      return;
    }
    
    // Clean up private key
    const cleanedPrivateKey = privateKey.replace(/\\n/g, '\n');
    
    // Initialize
    firebaseAdmin = initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: cleanedPrivateKey,
      }),
    });
    
    // Get auth instance
    adminAuth = getAuth(firebaseAdmin);
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    // Don't throw, just log
  }
};

// Initialize if not already initialized and not in build
if (!getApps().length) {
  initFirebaseAdmin();
} else {
  // If already initialized, get the auth instance
  firebaseAdmin = getApps()[0];
  adminAuth = getAuth(firebaseAdmin);
}

export { firebaseAdmin, adminAuth };