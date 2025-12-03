import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { email, password, fullName, userType } = await request.json();
    
    // Create user in Firebase Auth (requires Firebase Admin SDK)
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      displayName: fullName
    });
    
    return Response.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email
      }
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}