'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  IndianRupee
} from 'lucide-react';

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userType, setUserType] = useState('candidate');
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const router = useRouter();

  // Payment plans (₹1 for candidate, ₹2 for institute)
  const paymentPlans = {
    candidate: [
      {
        id: 'basic',
        name: 'Job Seeker Plan',
        price: 1, // ₹1
        originalPrice: 50,
        features: [
          'Access to all job listings',
          'Apply to unlimited jobs',
          'Resume builder & upload',
          'Priority profile visibility',
          'Email/SMS notifications',
          'Career guidance access'
        ]
      }
    ],
    institute: [
      {
        id: 'basic',
        name: 'Institute Starter',
        price: 2, // ₹2
        originalPrice: 200,
        features: [
          'Post up to 20 jobs',
          'Access to candidate database',
          'Advanced analytics dashboard',
          'Priority email support',
          'Company profile page',
          'Bulk candidate messaging'
        ]
      }
    ]
  };

  useEffect(() => {
    // Extract userType from URL
    const params = new URLSearchParams(window.location.search);
    const userTypeParam = params.get('userType') || 'candidate';
    setUserType(userTypeParam);
    
    // Set default plan
    const plans = paymentPlans[userTypeParam];
    if (plans && plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
    
    // Load Razorpay script
    loadRazorpay();
    checkAuth();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        setError('Failed to load Razorpay. Please refresh the page.');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const checkAuth = async () => {
    try {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          // Check if already paid
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().hasPaid) {
            router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
            return;
          }
        } else {
          router.push('/login?redirect=/payment');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication error. Please try again.');
      setLoading(false);
    }
  };

  const createRazorpayOrder = async (amount, currency = 'INR') => {
    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: currency,
          userType: userType,
          planId: selectedPlan.id,
          userId: user.uid,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.order;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUserPayment = async (paymentData) => {
    try {
      const userData = {
        hasPaid: true,
        paymentPlan: selectedPlan.id,
        paymentStatus: 'active',
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpaySignature: paymentData.razorpay_signature,
        lastPaymentDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subscriptionStart: new Date().toISOString(),
        subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
      };

      // Update users collection
      await updateDoc(doc(db, 'users', user.uid), userData);

      // Update type-specific collection
      const collectionName = userType === 'candidate' ? 'candidates' : 'institutes';
      await updateDoc(doc(db, collectionName, user.uid), {
        hasPaid: true,
        paymentPlan: selectedPlan.id,
        subscriptionActive: true,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      });

      return true;
    } catch (error) {
      console.error('Firestore update error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!user || !selectedPlan) {
      setError('Please select a plan and ensure you are logged in');
      return;
    }

    if (!razorpayLoaded) {
      setError('Razorpay is still loading. Please wait...');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Create Razorpay order
      const order = await createRazorpayOrder(selectedPlan.price);

      // Step 2: Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ClassDoor Job Portal',
        description: `${selectedPlan.name} - One Time Payment`,
        image: '/logo.png',
        order_id: order.id,
        handler: async (response) => {
          // Step 3: Verify payment
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: user.uid,
            userType: userType,
            planId: selectedPlan.id,
            amount: selectedPlan.price
          };

          const verificationResult = await verifyPayment(verificationData);

          if (verificationResult.success) {
            // Step 4: Update Firestore
            await updateUserPayment(response);
            
            setSuccess('Payment successful! Redirecting to dashboard...');
            
            // Redirect after 2 seconds
            setTimeout(() => {
              router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
            }, 2000);
          } else {
            setError(`Payment verification failed: ${verificationResult.error}`);
            setProcessing(false);
          }
        },
        prefill: {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          contact: '' // Add if you have user phone number
        },
        notes: {
          userId: user.uid,
          userType: userType,
          plan: selectedPlan.id
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError('Payment was cancelled');
          },
          escape: false,
          backdropclose: false
        }
      };

      // Step 5: Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment processing error:', error);
      setError(`Payment failed: ${error.message}`);
      setProcessing(false);
    }
  };

  const handleSkipPayment = async () => {
    if (confirm('You will have limited access with free plan. Continue?')) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hasPaid: false,
          paymentPlan: 'free',
          paymentStatus: 'free_tier',
          updatedAt: new Date().toISOString()
        });

        router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
      } catch (error) {
        setError('Error: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading payment gateway...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please login to proceed with payment</p>
          <button
            onClick={() => router.push('/login?redirect=/payment')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <IndianRupee className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Complete Your Registration
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get full access to all features with a one-time payment. 
            Special introductory pricing for early users!
          </p>
          
          <div className="inline-flex items-center mt-6 px-5 py-2.5 rounded-full bg-white shadow-sm border">
            {userType === 'candidate' ? (
              <>
                <User className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium text-gray-800">Job Seeker Account</span>
              </>
            ) : (
              <>
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium text-gray-800">Institute Account</span>
              </>
            )}
            <span className="ml-3 text-sm text-gray-500">Logged in as: {user.email}</span>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Selected Plan */}
          {selectedPlan && (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 transform lg:scale-105">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-3">
                    RECOMMENDED
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h2>
                  <p className="text-gray-600 mt-2">One-time payment for full access</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              {/* Price Display */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">₹{selectedPlan.price}</span>
                  <span className="text-gray-500 ml-2">one time</span>
                </div>
                {selectedPlan.originalPrice && (
                  <div className="mt-2">
                    <span className="text-gray-500 line-through">₹{selectedPlan.originalPrice}</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      {Math.round((1 - selectedPlan.price/selectedPlan.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing || !razorpayLoaded}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-3" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-3" />
                    Pay ₹{selectedPlan.price} Now
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure payment by Razorpay
              </p>
            </div>
          )}

          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">₹0</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>
              <p className="text-gray-600 mt-3">Basic access with limitations</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start text-gray-500">
                <ShieldCheck className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>Limited job applications (5/month)</span>
              </li>
              <li className="flex items-start text-gray-500">
                <ShieldCheck className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>Basic profile visibility</span>
              </li>
              <li className="flex items-start text-gray-500">
                <ShieldCheck className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>No priority support</span>
              </li>
              <li className="flex items-start text-gray-500">
                <ShieldCheck className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Limited analytics</span>
              </li>
            </ul>

            <button
              onClick={handleSkipPayment}
              className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
            >
              Continue with Free Plan
            </button>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              You can upgrade anytime
            </p>
          </div>
        </div>

        {/* Security & Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ShieldCheck className="h-6 w-6 text-green-600 mr-3" />
            Secure & Hassle-Free Payment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">100% Secure</h4>
              <p className="text-gray-600 text-sm">Bank-level security with Razorpay</p>
            </div>
            
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Instant Access</h4>
              <p className="text-gray-600 text-sm">Get full access immediately after payment</p>
            </div>
            
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Money-Back Guarantee</h4>
              <p className="text-gray-600 text-sm">7-day refund if not satisfied</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>Note:</strong> This is real payment integration. ₹1 for job seekers and ₹2 for institutes will be charged.
              Test cards available in Razorpay dashboard.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact support@classdoor.in</p>
          <button
            onClick={() => auth.signOut().then(() => router.push('/login'))}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Not {user.email}? Sign out
          </button>
        </div>
      </div>
    </div>
  );
}