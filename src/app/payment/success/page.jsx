// app/payment/success/page.jsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Share2, Home, User } from 'lucide-react';
import { auth, db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Inner component jo useSearchParams use karega
function PaymentSuccessContent() {
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
  }, [searchParams, router]);

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
      {/* ... rest of your JSX ... */}
    </div>
  );
}

// Main component with Suspense
export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}