// lib/firebase-admin.js - SIMPLIFIED VERSION

let adminAuth = null;
let adminDb = null;

// Only initialize if we have all required environment variables
const hasAdminConfig = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (typeof window === 'undefined' && hasAdminConfig) {
  try {
    // Dynamic import to avoid build errors
    const admin = await import('firebase-admin');
    const { initializeApp, cert, getApps } = admin;
    
    // Construct service account
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    if (!getApps().length) {
      const adminApp = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
      });
      
      adminAuth = admin.getAuth(adminApp);
      adminDb = admin.getFirestore(adminApp);
      console.log('✅ Firebase Admin SDK initialized');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    // Continue without Admin SDK
  }
} else {
  console.log('ℹ️ Firebase Admin SDK not initialized');
  // Create safe dummy objects
  adminAuth = {
    createUser: () => Promise.reject(new Error('Firebase Admin not configured')),
    verifyIdToken: () => Promise.reject(new Error('Firebase Admin not configured')),
  };
  adminDb = {
    collection: () => ({ 
      doc: () => ({ 
        get: () => Promise.reject(new Error('Firebase Admin not configured')),
        set: () => Promise.reject(new Error('Firebase Admin not configured'))
      })
    })
  };
}

export { adminAuth, adminDb };