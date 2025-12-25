// app/payment/success/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Share2, Home, User } from 'lucide-react';
import { auth, db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function PaymentSuccess() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const paymentId = searchParams.get('id');
      
      if (paymentId) {
        const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
        if (paymentDoc.exists()) {
          setPaymentDetails(paymentDoc.data());
        }
      }
      
      setLoading(false);
      
      // Redirect to dashboard after 5 seconds
      setTimeout(() => {
        router.push('/candidates/dashboard');
      }, 5000);
    };

    fetchPaymentDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Payment Successful! 🎉</h1>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your payment. Your premium account is now active.
          </p>
          
          {paymentDetails && (
            <div className="mb-10 p-6 bg-gray-50 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-mono text-gray-800">{paymentDetails.paymentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{paymentDetails.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-gray-800">
                    {new Date(paymentDetails.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/candidates/dashboard')}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-800 transition"
            >
              <Home className="inline h-5 w-5 mr-2" />
              Go to Dashboard
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.print()}
                className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                <Download className="inline h-4 w-4 mr-2" />
                Download Receipt
              </button>
              
              <button
                onClick={() => router.push('/profile')}
                className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                <User className="inline h-4 w-4 mr-2" />
                Complete Profile
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-gray-500 text-sm">
            You will be redirected to dashboard in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}