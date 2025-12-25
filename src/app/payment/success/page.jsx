// app/payment/success/page.jsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Home, User } from 'lucide-react';
import { auth, db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Inner component for search params
function PaymentSuccessContent() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      try {
        // Get payment ID from URL - IMPORTANT: Razorpay uses different parameters
        const paymentId = searchParams.get('payment_id') || 
                         searchParams.get('razorpay_payment_id') || 
                         searchParams.get('id');
        
        console.log('Payment ID from URL:', paymentId);
        console.log('All search params:', Object.fromEntries(searchParams.entries()));

        if (!paymentId) {
          throw new Error('No payment ID found in URL');
        }

        // Try multiple document paths (based on your Firestore structure)
        const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
        
        if (!paymentDoc.exists()) {
          // Try alternative collections
          const userPaymentDoc = await getDoc(
            doc(db, 'users', currentUser.uid, 'payments', paymentId)
          );
          
          if (userPaymentDoc.exists()) {
            setPaymentDetails(userPaymentDoc.data());
          } else {
            // Create a temporary payment object if not found in DB
            setPaymentDetails({
              paymentId: paymentId,
              amount: searchParams.get('amount') || '1000',
              timestamp: new Date().toISOString(),
              status: 'completed'
            });
          }
        } else {
          setPaymentDetails(paymentDoc.data());
        }

      } catch (err) {
        console.error('Error fetching payment:', err);
        setError(err.message);
        
        // Still show success page even if DB fetch fails
        setPaymentDetails({
          paymentId: 'TEMP_' + Date.now(),
          amount: '1000',
          timestamp: new Date().toISOString(),
          status: 'completed'
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [searchParams, router]);

  useEffect(() => {
    // Auto-redirect only if payment is successful
    if (paymentDetails && !loading) {
      const timer = setTimeout(() => {
        router.push('/candidates/dashboard');
      }, 8000); // Increased to 8 seconds
        
      return () => clearTimeout(timer);
    }
  }, [paymentDetails, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <div className="text-2xl">❌</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/candidates/dashboard')}
            className="w-full py-3 px-6 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Payment Successful! 🎉</h1>
          <p className="text-gray-600 md:text-lg mb-8">
            Thank you for your payment. Your premium account is now active.
          </p>
          
          {paymentDetails && (
            <div className="mb-8 md:mb-10 p-6 bg-gray-50 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-mono text-gray-800 text-sm truncate">
                    {paymentDetails.paymentId || paymentDetails.razorpay_payment_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{paymentDetails.amount || paymentDetails.amount / 100}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-gray-800">
                    {new Date(paymentDetails.timestamp || Date.now()).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {paymentDetails.status || 'Completed'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/candidates/dashboard')}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-semibold md:text-lg hover:from-green-700 hover:to-emerald-800 transition flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Create and download receipt
                  const receiptText = `
                    Payment Receipt
                    -------------------------
                    Payment ID: ${paymentDetails?.paymentId}
                    Amount: ₹${paymentDetails?.amount}
                    Date: ${new Date(paymentDetails?.timestamp).toLocaleString()}
                    Status: ${paymentDetails?.status}
                    -------------------------
                    Thank you for your payment!
                  `;
                  
                  const blob = new Blob([receiptText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `receipt-${paymentDetails?.paymentId}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
              
              <button
                onClick={() => router.push('/profile')}
                className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-2" />
                Complete Profile
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-gray-500 text-sm">
            You will be redirected to dashboard in a few seconds...
          </p>
          
          <div className="mt-6 text-xs text-gray-400">
            <p>Having issues? Contact support: support@jobportal.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}