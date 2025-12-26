// app/payment/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/src/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  IndianRupee,
  Star,
  Zap,
  Target,
  HeartHandshake,
  Phone,
  Mail,
  Lock,
  Globe,
  Users,
  Award,
  BadgeCheck,
  AlertTriangle
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
  const [showSupport, setShowSupport] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Professional Payment plans
  const paymentPlans = {
    candidate: [
      {
        id: 'premium_jobseeker',
        name: 'Job Seeker Pro',
        tagline: 'Kickstart Your Career',
        price: 599,
        originalPrice: 2999,
        period: 'one-time',
        color: 'from-blue-600 to-purple-600',
        badge: 'MOST POPULAR',
        features: [
          { text: 'Unlimited Job Applications', icon: Zap },
          { text: 'Priority Profile Ranking', icon: Star },
          { text: 'Resume Review by Experts', icon: BadgeCheck },
          { text: 'Direct Employer Access', icon: Users },
          { text: 'Career Guidance Sessions', icon: Target },
          { text: 'Interview Preparation Kit', icon: Award },
          { text: 'Job Alert Priority', icon: Globe },
          { text: '24/7 Support Access', icon: ShieldCheck }
        ],
        cta: 'Get Premium Access',
        applicationsLimit: -1 // -1 means unlimited
      }
    ],
    institute: [
      {
        id: 'institute_pro',
        name: 'Institute Pro',
        tagline: 'Hire Top Talent',
        price: 999,
        originalPrice: 4999,
        period: 'one-time',
        color: 'from-green-600 to-teal-600',
        badge: 'BEST VALUE',
        features: [
          { text: 'Post Unlimited Jobs', icon: Zap },
          { text: 'Access 10,000+ Candidates', icon: Users },
          { text: 'Advanced Analytics Dashboard', icon: Target },
          { text: 'AI-Powered Candidate Matching', icon: Award },
          { text: 'Bulk Email & SMS Campaigns', icon: Mail },
          { text: 'Dedicated Account Manager', icon: User },
          { text: 'Custom Branded Career Page', icon: Globe },
          { text: 'Priority Support', icon: ShieldCheck }
        ],
        cta: 'Upgrade to Pro',
        jobPostsLimit: -1 // -1 means unlimited
      }
    ]
  };

  // Free plan configuration
  const freePlan = {
    candidate: {
      applicationsLimit: 5,
      features: [
        'Limited job applications (5/month)',
        'Basic profile visibility',
        'Email notifications',
        'Community support'
      ]
    },
    institute: {
      jobPostsLimit: 3,
      features: [
        'Post up to 3 jobs',
        'Basic candidate access',
        'Email notifications',
        'Community support'
      ]
    }
  };

  useEffect(() => {
    const userTypeParam = searchParams.get('userType') || 'candidate';
    setUserType(userTypeParam);
    
    const plans = paymentPlans[userTypeParam];
    if (plans && plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
    
    loadRazorpay();
    checkAuth();
  }, [searchParams]);

  const loadRazorpay = () => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        setError('Payment gateway failed to load. Please refresh.');
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
          
          // Fetch user profile
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile(userData);
            
            // Check if already paid and redirect to home, not dashboard
            if (userData.hasPaid) {
              router.push('/');
              return;
            }
          } else {
            // Create initial user profile
            const collectionName = userType === 'candidate' ? 'candidates' : 'institutes';
            const profileRef = doc(db, collectionName, currentUser.uid);
            const profileDoc = await getDoc(profileRef);
            
            if (!profileDoc.exists()) {
              const baseProfile = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || '',
                userType: userType,
                hasPaid: false,
                paymentPlan: 'free',
                createdAt: new Date().toISOString(),
                ...(userType === 'candidate' ? {
                  applicationsUsed: 0,
                  applicationsLimit: freePlan.candidate.applicationsLimit,
                  lastResetDate: new Date().toISOString()
                } : {
                  jobPostsUsed: 0,
                  jobPostsLimit: freePlan.institute.jobPostsLimit,
                  lastResetDate: new Date().toISOString()
                })
              };
              
              await setDoc(profileRef, baseProfile);
              await setDoc(doc(db, 'users', currentUser.uid), {
                ...baseProfile,
                lastLogin: new Date().toISOString()
              });
              
              setUserProfile(baseProfile);
            }
          }
        } else {
          router.push(`/login?redirect=/payment${userType ? `?userType=${userType}` : ''}`);
          return;
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication error. Please login again.');
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
          amount: amount * 100,
          currency: currency,
          userType: userType,
          planId: selectedPlan.id,
          userId: user?.uid,
          email: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      
      if (!data.id) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      return data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw new Error(`Payment setup failed: ${error.message}`);
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

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty verification response');
      }

      return JSON.parse(text);
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
        paymentAmount: selectedPlan.price,
        paymentDate: new Date().toISOString(),
        subscriptionStart: new Date().toISOString(),
        subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        upgradedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', user.uid), userData);

      const collectionName = userType === 'candidate' ? 'candidates' : 'institutes';
      const updateData = {
        hasPaid: true,
        paymentPlan: selectedPlan.id,
        subscriptionActive: true,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        ...(userType === 'candidate' ? {
          applicationsLimit: -1 // Unlimited for premium
        } : {
          jobPostsLimit: -1 // Unlimited for premium
        })
      };

      await updateDoc(doc(db, collectionName, user.uid), updateData);

      return true;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!user || !selectedPlan) {
      setError('Please login and select a plan');
      return;
    }

    if (!razorpayLoaded) {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError('Payment system not ready. Please refresh.');
        return;
      }
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const order = await createRazorpayOrder(selectedPlan.price);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ClassDoor Pro',
        description: `${selectedPlan.name} - Lifetime Access`,
        image: '/logo.png',
        order_id: order.id,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
              userId: user.uid,
              userType: userType,
              planId: selectedPlan.id,
              amount: selectedPlan.price
            };

            const verificationResult = await verifyPayment(verificationData);

            if (verificationResult.success) {
              await updateUserPayment(response);
              
              setSuccess('🎉 Payment Successful! Redirecting to home...');
              
              setTimeout(() => {
                router.push('/'); // Redirect to home page instead of dashboard
              }, 1500);
            } else {
              throw new Error(verificationResult.error || 'Payment verification failed');
            }
          } catch (error) {
            setError(`Payment verification failed: ${error.message}. Call support: 70799 48109`);
            setProcessing(false);
          }
        },
        prefill: {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
        },
        notes: {
          userId: user.uid,
          userType: userType,
          plan: selectedPlan.name,
          email: user.email
        },
        theme: {
          color: userType === 'candidate' ? '#3B82F6' : '#10B981'
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
          escape: false,
          backdropclose: false
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', async (response) => {
        const errorMsg = `Payment failed: ${response.error.description}. Call support: 70799 48109`;
        setError(errorMsg);
        setProcessing(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = `Payment failed: ${error.message}. Call support: 70799 48109`;
      setError(errorMsg);
      setProcessing(false);
    }
  };

  const handleFreeTrial = async () => {
    if (confirm('You will have limited access with free plan. Continue?')) {
      try {
        // Update user document
        await updateDoc(doc(db, 'users', user.uid), {
          hasPaid: false,
          paymentPlan: 'free',
          paymentStatus: 'free_tier',
          freeTrialStart: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });

        const collectionName = userType === 'candidate' ? 'candidates' : 'institutes';
        
        // Update profile with free plan limits
        const freePlanData = {
          hasPaid: false,
          paymentPlan: 'free',
          subscriptionActive: false,
          ...(userType === 'candidate' ? {
            applicationsUsed: 0,
            applicationsLimit: freePlan.candidate.applicationsLimit,
            lastResetDate: new Date().toISOString()
          } : {
            jobPostsUsed: 0,
            jobPostsLimit: freePlan.institute.jobPostsLimit,
            lastResetDate: new Date().toISOString()
          })
        };

        await updateDoc(doc(db, collectionName, user.uid), freePlanData);
        
        // Redirect to home page
        router.push('/');

      } catch (error) {
        setError('Error: ' + error.message);
      }
    }
  };

  const makeCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading premium features...</p>
        <p className="text-sm text-gray-500 mt-2">Securing your account</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6">
            <IndianRupee className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
            Unlock Your {userType === 'candidate' ? 'Career' : 'Hiring'} Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Invest in your {userType === 'candidate' ? 'future' : 'success'} with our premium platform
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 animate-fadeIn">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-1">Payment Error</h3>
                  <p className="text-red-700">{error}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => makeCall('7079948109')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support Now: 70799 48109
                    </button>
                    <button
                      onClick={() => setShowSupport(true)}
                      className="border border-red-600 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition"
                    >
                      More Support Options
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="max-w-3xl mx-auto mb-8 animate-fadeIn">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl shadow-sm">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Success!</h3>
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Plan Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Selected Plan Card */}
            {selectedPlan && (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                <div className={`bg-gradient-to-r ${selectedPlan.color} p-8 text-white relative`}>
                  {selectedPlan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        {selectedPlan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedPlan.name}</h2>
                      <p className="text-blue-100 opacity-90">{selectedPlan.tagline}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="flex items-baseline justify-end">
                        <span className="text-5xl font-bold">₹{selectedPlan.price}</span>
                        <span className="text-blue-100 ml-2">/{selectedPlan.period}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-blue-200 line-through">₹{selectedPlan.originalPrice}</span>
                        <span className="ml-3 bg-white/20 px-3 py-1 rounded-full text-sm">
                          Save {Math.round((1 - selectedPlan.price/selectedPlan.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {selectedPlan.features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3 group">
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg group-hover:scale-110 transition-transform">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing || !razorpayLoaded}
                    className={`w-full py-5 px-6 bg-gradient-to-r ${selectedPlan.color} text-white rounded-2xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center`}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-3" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-3" />
                        {selectedPlan.cta} - ₹{selectedPlan.price}
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Secure payment powered by Razorpay</span>
                  </div>
                </div>
              </div>
            )}

            {/* Free Plan Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4">
                  <HeartHandshake className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Free</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-500 ml-2">forever</span>
                </div>
                <p className="text-gray-600 mt-3">
                  {userType === 'candidate' 
                    ? `${freePlan.candidate.applicationsLimit} applications/month` 
                    : `Post ${freePlan.institute.jobPostsLimit} jobs`}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {freePlan[userType].features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-500">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleFreeTrial}
                className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all hover:border-gray-400 flex items-center justify-center"
              >
                <HeartHandshake className="h-5 w-5 mr-2" />
                Continue with Free Plan
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                You can apply to jobs immediately after signing up
              </p>
            </div>
          </div>

          {/* Right Column - User Info & Security */}
          <div className="space-y-8">
            {/* User Info Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                  {userType === 'candidate' ? (
                    <User className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Building className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {userType === 'candidate' ? 'Job Seeker Account' : 'Institute Account'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                  <div className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Account Status</p>
                      <p className="text-sm text-gray-600">
                        {userProfile?.hasPaid ? 'Premium Member' : 'Free Account'}
                      </p>
                    </div>
                  </div>
                </div>

                {userProfile && userType === 'candidate' && !userProfile.hasPaid && (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Free Plan Limit</p>
                        <p className="text-sm text-gray-600">
                          {userProfile.applicationsUsed || 0}/{userProfile.applicationsLimit || 5} applications used
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => auth.signOut().then(() => router.push('/'))}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Not {user.email}? Sign out
                </button>
              </div>
            </div>

            {/* Security & Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <ShieldCheck className="h-6 w-6 mr-3 text-green-400" />
                Safe & Secure
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Bank-Level Security</p>
                    <p className="text-gray-300 text-sm">256-bit SSL encryption</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">7-Day Refund Policy</p>
                    <p className="text-gray-300 text-sm">100% satisfaction guarantee</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Trusted Platform</p>
                    <p className="text-gray-300 text-sm">Used by 10,000+ professionals</p>
                  </div>
                </div>

                {/* Support Section */}
                <div className="pt-6 border-t border-gray-700">
                  <button
                    onClick={() => makeCall('7079948109')}
                    className="w-full flex items-center space-x-3 hover:bg-gray-800/50 p-3 rounded-xl transition justify-center bg-blue-600 hover:bg-blue-700 mb-4"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">Call Support: 70799 48109</span>
                  </button>

                  <div 
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800/50 p-3 rounded-xl transition"
                    onClick={() => setShowSupport(!showSupport)}
                  >
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium">More Support Options</p>
                      <p className="text-gray-300 text-sm">Click to expand</p>
                    </div>
                  </div>

                  {showSupport && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-xl animate-fadeIn">
                      <p className="font-medium mb-3">Contact Support</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => makeCall('7079948109')}
                          className="w-full flex items-center space-x-3 hover:text-blue-300 transition text-left"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="flex-1">Instant Call: +91 70799 48109</span>
                        </button>
                        <a 
                          href="https://wa.me/917079948109"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 hover:text-blue-300 transition"
                        >
                          <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">W</span>
                          </div>
                          <span>WhatsApp: +91 70799 48109</span>
                        </a>
                        <a 
                          href="mailto:support@classdoor.in"
                          className="flex items-center space-x-3 hover:text-blue-300 transition"
                        >
                          <Mail className="h-4 w-4" />
                          <span>support@classdoor.in</span>
                        </a>
                        <p className="text-sm text-gray-400 mt-3">
                          Available 9 AM - 9 PM, 7 days a week
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-4 text-center">Trusted By</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                    <div className="text-xs text-gray-500">Users</div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.8</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">99%</div>
                    <div className="text-xs text-gray-500">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100 rounded-2xl p-6">
            <p className="text-gray-700 text-center mb-4">
              <strong>Important:</strong> This is a real payment gateway. 
              {userType === 'candidate' ? ' ₹599 for Job Seekers' : ' ₹999 for Institutes'} will be charged.
              For testing, use Razorpay test mode.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => makeCall('7079948109')}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                <Phone className="h-4 w-4" />
                Emergency Support: 70799 48109
              </button>
              <div className="text-sm text-gray-500">
                PCI DSS Level 1 Certified • ISO 27001 Certified
              </div>
            </div>
            <div className="flex items-center justify-center mt-4">
              <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-8 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}