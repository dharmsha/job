// app/payment/page.js - UPDATED VERSION
'use client'; // ✅ YE LINE ZAROOR ADD KAREIN

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ❌ useSearchParams hata dein
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
  AlertCircle
} from 'lucide-react';

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userType, setUserType] = useState('candidate');
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const router = useRouter();

  // Remove useSearchParams - query parameters ke liye alternative
  useEffect(() => {
    // URL se parameters extract karein
    const params = new URLSearchParams(window.location.search);
    const userTypeParam = params.get('userType') || 'candidate';
    setUserType(userTypeParam);
    
    // Payment plans set karein
    const plans = paymentPlans[userTypeParam];
    if (plans && plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
    
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Firebase auth check
      auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          checkPaymentStatus(currentUser.uid);
        } else {
          router.push('/login');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication error');
      setLoading(false);
    }
  };

  // Payment plans
  const paymentPlans = {
    candidate: [
      {
        id: 'basic',
        name: 'Candidate Basic',
        price: 50,
        features: [
          'Access to all job listings',
          'Apply to 50 jobs/month',
          'Resume upload',
          'Basic profile visibility',
          'Email notifications'
        ]
      }
    ],
    institute: [
      {
        id: 'basic',
        name: 'Institute Basic',
        price: 200,
        features: [
          'Post up to 10 jobs',
          'Access to candidate database',
          'Basic analytics',
          'Email support',
          'Profile page'
        ]
      },
      {
        id: 'premium',
        name: 'Institute Premium',
        price: 500,
        features: [
          'Unlimited job posts',
          'Premium candidate access',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'Bulk candidate messaging'
        ]
      }
    ]
  };

  const checkPaymentStatus = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.hasPaid) {
          // Already paid, redirect to dashboard
          router.push(userData.userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handlePayment = async (plan) => {
    if (!user) {
      setError('Please login first');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Mock payment for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user payment status
      await updateDoc(doc(db, 'users', user.uid), {
        hasPaid: true,
        paymentPlan: plan.id,
        paymentStatus: 'active',
        lastPaymentDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Update specific collection
      if (userType === 'candidate') {
        await updateDoc(doc(db, 'candidates', user.uid), {
          hasPaid: true,
          paymentPlan: plan.id,
          subscriptionActive: true
        });
      } else {
        await updateDoc(doc(db, 'institutes', user.uid), {
          hasPaid: true,
          paymentPlan: plan.id,
          subscriptionActive: true
        });
      }

      setSuccess('Payment successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      setError(`Payment failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleSkipPayment = async () => {
    if (confirm('Are you sure? Some features may be limited without payment.')) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hasPaid: false,
          paymentPlan: 'free',
          paymentStatus: 'free_tier',
          updatedAt: new Date().toISOString()
        });

        router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard');
      } catch (error) {
        setError('Error updating account: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold">User not logged in</h1>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <CreditCard className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Registration
          </h1>
          <p className="text-gray-600 mt-2">
            Choose a plan to access all features
          </p>
          <div className="inline-flex items-center mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
            {userType === 'candidate' ? (
              <>
                <User className="h-4 w-4 mr-2" />
                Job Seeker Account
              </>
            ) : (
              <>
                <Building className="h-4 w-4 mr-2" />
                Institute Account
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Payment Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentPlans[userType]?.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg border-2 p-6 transition-all ${
                selectedPlan?.id === plan.id 
                  ? 'border-blue-600 transform scale-105' 
                  : 'border-gray-200 hover:border-blue-400'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-500">/one-time</span>
                  </div>
                </div>
                {selectedPlan?.id === plan.id && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={processing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  selectedPlan?.id === plan.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing && selectedPlan?.id === plan.id ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${plan.price}`
                )}
              </button>
            </div>
          ))}

          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">₹0</span>
                <span className="text-gray-500">/forever</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Limited access with basic features
              </p>
            </div>

            <ul className="space-y-3 my-6">
              <li className="flex items-center text-gray-500">
                <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Limited job applications</span>
              </li>
              <li className="flex items-center text-gray-500">
                <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Basic profile</span>
              </li>
              <li className="flex items-center text-gray-500">
                <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Email notifications</span>
              </li>
            </ul>

            <button
              onClick={handleSkipPayment}
              className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Continue with Free Plan
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Upgrade anytime
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mt-10 bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <CreditCard className="h-5 w-5 inline-block mr-2" />
            Secure Payment Information
          </h3>
          <div className="text-sm text-gray-600">
            <p className="mb-2">This is a mock payment system for testing.</p>
            <p>Real Razorpay integration will be added later.</p>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Logged in as: <span className="font-medium">{user.email}</span></p>
          <button
            onClick={() => auth.signOut().then(() => router.push('/login'))}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Not you? Sign out
          </button>
        </div>
      </div>
    </div>
  );
}