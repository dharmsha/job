'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { 
  Eye, EyeOff, Mail, Lock, User, School, 
  UserPlus, CheckCircle, XCircle, Loader2,
  CreditCard, ShieldCheck, ArrowLeft, Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [existingUser, setExistingUser] = useState(false);

  const router = useRouter();

  // Check if user already exists on email change
  useEffect(() => {
    const checkExistingUser = async () => {
      if (!email.includes('@') || !email.includes('.')) return;
      
      try {
        // Check if user exists in Firestore by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setExistingUser(true);
          setIsSignup(false); // Force login mode if user exists
        } else {
          setExistingUser(false);
        }
      } catch (error) {
        console.log('Error checking user:', error);
      }
    };

    const debounceTimer = setTimeout(() => {
      checkExistingUser();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [email]);

  // 📝 Handle Login with Smart Subscription Check
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Login successful:', user.email);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        setError('User account not found. Please sign up first.');
        setIsSignup(true);
        setLoading(false);
        return;
      }
      
      const userData = userDoc.data();
      
      // Check subscription status
      const subscriptionStatus = await checkSubscriptionStatus(userData, user.uid);
      
      if (subscriptionStatus === 'active') {
        // Redirect to dashboard
        if (userData.userType === 'candidate') {
          router.push('/candidates/dashboard');
        } else {
          router.push('/institutes/dashboard');
        }
      } else if (subscriptionStatus === 'expired') {
        // Show subscription expired message with renew option
        setError('Your subscription has expired. Please renew to continue using the platform.');
        
        // Wait 2 seconds then redirect to payment
        setTimeout(() => {
          router.push(`/payment?userType=${userData.userType}&userId=${user.uid}&email=${encodeURIComponent(user.email)}&renew=true`);
        }, 2000);
      } else if (subscriptionStatus === 'payment_pending') {
        // User signed up but didn't complete payment
        setError('Please complete your payment to activate your account.');
        
        setTimeout(() => {
          router.push(`/payment?userType=${userData.userType}&userId=${user.uid}&email=${encodeURIComponent(user.email)}`);
        }, 2000);
      } else {
        // No subscription found
        setError('Subscription not found. Please complete payment.');
        
        setTimeout(() => {
          router.push(`/payment?userType=${userData.userType}&userId=${user.uid}&email=${encodeURIComponent(user.email)}`);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      
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

  // 📝 Improved Subscription Status Check
  const checkSubscriptionStatus = async (userData, userId) => {
    try {
      // First check if user has paid
      if (!userData.hasPaid) {
        return 'payment_pending';
      }
      
      // Check if subscription is active
      if (!userData.subscriptionActive) {
        return 'inactive';
      }
      
      // Check for free trial (if any)
      if (userData.subscriptionPlan === 'free_trial') {
        // Check trial expiry
        if (userData.trialExpiry) {
          const expiryDate = userData.trialExpiry.toDate();
          const currentDate = new Date();
          
          if (currentDate > expiryDate) {
            // Update status in Firestore
            await updateDoc(doc(db, 'users', userId), {
              subscriptionActive: false,
              subscriptionStatus: 'expired'
            });
            return 'expired';
          }
        }
        return 'active';
      }
      
      // Check paid subscription expiry
      if (userData.subscriptionExpiry) {
        const expiryDate = userData.subscriptionExpiry.toDate();
        const currentDate = new Date();
        
        if (currentDate > expiryDate) {
          // Update status in Firestore
          await updateDoc(doc(db, 'users', userId), {
            subscriptionActive: false,
            subscriptionStatus: 'expired'
          });
          return 'expired';
        }
        return 'active';
      }
      
      // Default to inactive if no expiry date found
      return 'inactive';
      
    } catch (error) {
      console.error('Error checking subscription:', error);
      return 'error';
    }
  };

  // 📝 Handle Signup - Only for NEW USERS
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
    
    // Check if user already exists
    if (existingUser) {
      setError('An account with this email already exists. Please login instead.');
      setIsSignup(false);
      return;
    }
    
    setLoading(true);

    try {
      console.log('Creating new user with email:', email);
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);
      
      // User data for NEW USER
      const userData = {
        uid: user.uid,
        email: user.email.toLowerCase(),
        fullName: fullName.trim(),
        userType: userType,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        profileComplete: false,
        
        // NEW USER - No subscription yet
        subscriptionActive: false,
        subscriptionPlan: 'none',
        subscriptionStatus: 'inactive',
        subscriptionStartDate: null,
        subscriptionExpiry: null,
        hasPaid: false,
        paymentStatus: 'pending',
        lastPaymentDate: null,
        isNewUser: true
      };
      
      // Save to users collection
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // Save to specific collection based on user type
      if (userType === 'candidate') {
        await setDoc(doc(db, 'candidates', user.uid), {
          ...userData,
          resumeUploaded: false,
          totalApplications: 0,
          profilePicture: null,
          savedJobs: [],
          subscriptionExpiry: null
        });
      } else {
        await setDoc(doc(db, 'institutes', user.uid), {
          ...userData,
          instituteName: fullName.trim(),
          jobsPosted: 0,
          verified: false,
          location: '',
          postedJobs: [],
          subscriptionExpiry: null
        });
      }
      
      setSuccess('Account created successfully! Redirecting to payment...');
      
      // Redirect to payment page for NEW USER
      setTimeout(() => {
        router.push(`/payment?userType=${userType}&userId=${user.uid}&email=${encodeURIComponent(user.email)}&newUser=true`);
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

  // 🔐 Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');
    
    if (!forgotEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSuccess(`Password reset email sent to ${forgotEmail}. Check your inbox.`);
      setForgotEmail('');
      
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotSuccess('');
      }, 5000);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
        setIsSignup(true);
        setIsForgotPassword(false);
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 📋 Error Messages
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

  // Email input with auto-detection
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  // Mode toggle with logic
  const handleModeToggle = (mode) => {
    if (mode === 'signup' && existingUser) {
      setError('An account with this email already exists. Please login instead.');
      return;
    }
    setIsSignup(mode === 'signup');
    setError('');
  };

  // Forgot Password Modal
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* ... (same as before) ... */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Start your journey with ClassDoor' : 'Login to access your dashboard'}
          </p>
          
          {/* Existing User Detection */}
          {email && existingUser && !isSignup && (
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              Account found. Please login.
            </div>
          )}
          
          {/* Subscription Notice */}
          {isSignup && !existingUser && (
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              1 Month Subscription after payment
            </div>
          )}
        </div>

        {/* User Type Selector - Only show during signup for NEW users */}
        {isSignup && !existingUser && (
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
        )}

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
                      onClick={() => handleModeToggle('signup')}
                      className="text-red-600 font-medium hover:text-red-800 text-sm mt-1 inline-flex items-center"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Click here to create account
                    </button>
                  )}
                  {error.includes('already exists') && (
                    <button
                      onClick={() => handleModeToggle('login')}
                      className="text-blue-600 font-medium hover:text-blue-800 text-sm mt-1 inline-flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Click here to login
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mode Toggle with smart detection */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => handleModeToggle('login')}
              className={`flex-1 pb-3 text-center font-medium ${!isSignup ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => handleModeToggle('signup')}
              disabled={existingUser}
              className={`flex-1 pb-3 text-center font-medium ${isSignup ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} ${existingUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign Up
            </button>
          </div>

          {/* Subscription Info Banner - Only for NEW signup */}
          {isSignup && !existingUser && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Subscription Information</h3>
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">1 Month Access</p>
                    <p className="text-xs">Dashboard access for 30 days after payment</p>
                  </div>
                </div>
                
                {userType === 'candidate' ? (
                  <div className="ml-6">
                    <p className="font-medium mb-1">Job Seeker Features:</p>
                    <ul className="text-xs space-y-1 ml-2">
                      <li className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Apply to unlimited jobs
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Resume upload & profile builder
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Application tracking
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="ml-6">
                    <p className="font-medium mb-1">Institute Features:</p>
                    <ul className="text-xs space-y-1 ml-2">
                      <li className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Post unlimited job vacancies
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Access to candidate database
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Application management
                      </li>
                    </ul>
                  </div>
                )}
                
                <div className="mt-2 p-2 bg-white rounded border border-blue-300">
                  <p className="text-xs font-medium text-blue-800">
                    <CreditCard className="inline-block h-3 w-3 mr-1" />
                    Secure payment via Razorpay
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
            
            {isSignup && !existingUser && (
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
                  placeholder={userType === 'candidate' ? 'Your Name' : 'ABC Public School'}
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
                onChange={handleEmailChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
              {existingUser && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Account exists. Please login.
                </p>
              )}
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
              {isSignup && !existingUser && <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>}
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignup && existingUser)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : isSignup ? (
                existingUser ? 'Account Exists - Please Login' : 'Create Account & Continue to Payment'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>
            <div className="mt-2 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-gray-400 mr-1" />
              <span>Secure authentication powered by Firebase</span>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}