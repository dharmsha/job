'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  Eye, EyeOff, Mail, Lock, User, School, 
  UserPlus, CheckCircle, XCircle, Loader2,
  Key
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState('candidate');
  const [fullName, setFullName] = useState('');
  const [showDirectFirebase, setShowDirectFirebase] = useState(false);
  
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  // 📝 Handle Login with better error handling
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Login successful:', user.email);
      
      // Check if user exists in Firestore
      setTimeout(() => {
        if (userType === 'candidate') {
          router.push('/candidates/dashboard');
        } else {
          router.push('/institutes/dashboard');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Login error code:', error.code);
      console.error('Login error message:', error.message);
      
      // Special handling for invalid credential
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. User does not exist. Click "Create Account" to sign up.');
        setIsSignup(true);
      } else {
        setError(getErrorMessage(error.code));
      }
    } finally {
      setLoading(false);
    }
  };

  // 📝 Handle Signup - create user in Firebase
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Creating user with email:', email);
      
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Auth:', user.uid);
      
      // Step 2: Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        fullName: fullName.trim(),
        userType: userType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false
      };
      
      // Save to users collection
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('User saved to Firestore');
      
      // Save to specific collection based on user type
      if (userType === 'candidate') {
        await setDoc(doc(db, 'candidates', user.uid), {
          ...userData,
          resumeUploaded: false,
          totalApplications: 0,
          profilePicture: null
        });
      } else {
        await setDoc(doc(db, 'institutes', user.uid), {
          ...userData,
          instituteName: fullName.trim(),
          jobsPosted: 0,
          verified: false,
          location: ''
        });
      }
      
      setSuccess(`🎉 Account created successfully! Logging you in...`);
      
      // Auto login after signup
      setTimeout(() => {
        if (userType === 'candidate') {
          router.push('/candidates/dashboard');
        } else {
          router.push('/institutes/dashboard');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please login instead.');
        setIsSignup(false);
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Check your internet connection.');
      } else {
        setError(`Signup failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Google Login
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || user.email?.split('@')[0],
        userType: userType,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
      
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Google login failed. Please try email/password.');
    }
  };

  // 📋 Better Error Messages
  const getErrorMessage = (errorCode) => {
    const messages = {
      'auth/user-not-found': 'User not found. Please create an account first.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/user-disabled': 'Account disabled. Contact support.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/invalid-credential': 'Invalid credentials. User does not exist.',
      'auth/network-request-failed': 'Network error. Check internet connection.',
      'auth/weak-password': 'Password too weak (min 6 characters).'
    };
    return messages[errorCode] || 'Authentication failed. Please try again.';
  };

  // 🚀 Direct Firebase Test - Create user via API
  const createTestUserViaAPI = async () => {
    setLoading(true);
    try {
      // Using direct fetch to create user
      const response = await fetch('/api/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123456',
          fullName: 'Test User',
          userType: 'candidate'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Test user created! Email: test@example.com, Password: test123456');
        setEmail('test@example.com');
        setPassword('test123456');
      } else {
        setError(data.error || 'Failed to create test user');
      }
    } catch (error) {
      setError('API error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignup ? 'Create Account' : 'Job Portal Login'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Start your journey' : 'Access your dashboard'}
          </p>
        </div>

        {/* User Type Selector */}
        <div className="bg-white rounded-xl p-1 mb-6 flex border shadow-sm">
          <button
            type="button"
            onClick={() => setUserType('candidate')}
            className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all ${
              userType === 'candidate'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="inline-block h-4 w-4 mr-2" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setUserType('institute')}
            className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all ${
              userType === 'institute'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <School className="inline-block h-4 w-4 mr-2" />
            Institute
          </button>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm">{error}</p>
                  {error.includes('does not exist') && (
                    <button
                      onClick={() => setIsSignup(true)}
                      className="text-red-600 font-medium hover:text-red-800 text-sm mt-1 inline-flex items-center"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Click here to create account
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 pb-3 text-center font-medium ${!isSignup ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 pb-3 text-center font-medium ${isSignup ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
            
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline-block h-4 w-4 mr-1" />
                  {userType === 'candidate' ? 'Full Name' : 'Institute Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={userType === 'candidate' ? 'John Doe' : 'ABC Public School'}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline-block h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline-block h-4 w-4 mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isSignup && <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>}
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 mb-4"
          >
            <svg className="w-5 h-5 mr-3">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Quick Test Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Need a test account?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setEmail('test.candidate@gmail.com');
                  setPassword('test123456');
                  setFullName('Test Candidate');
                  setUserType('candidate');
                  setError('');
                  setIsSignup(false);
                }}
                className="w-full text-sm py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Use Candidate Test Credentials
              </button>
              
              <button
                onClick={() => {
                  setEmail('test.institute@gmail.com');
                  setPassword('test123456');
                  setFullName('Test Institute');
                  setUserType('institute');
                  setError('');
                  setIsSignup(false);
                }}
                className="w-full text-sm py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Use Institute Test Credentials
              </button>
              
              <button
                onClick={() => setShowDirectFirebase(!showDirectFirebase)}
                className="w-full text-sm py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {showDirectFirebase ? 'Hide' : 'Show'} Direct Firebase Script
              </button>
            </div>
            
            {showDirectFirebase && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 mb-2">
                  Copy this code and run in browser console to create test user:
                </p>
                <pre className="text-xs bg-black text-white p-2 rounded overflow-x-auto">
{`// Browser console mein chalao
const firebaseConfig = {
  apiKey: "AIzaSy...", // Tera API key
  authDomain: "teraproject.firebaseapp.com",
  projectId: "teraproject",
  storageBucket: "teraproject.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = firebase.initializeApp(firebaseConfig);
app.auth().createUserWithEmailAndPassword("test@gmail.com", "test123456")
  .then(user => console.log("User created:", user.email))
  .catch(error => console.log("Error:", error.message));`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}