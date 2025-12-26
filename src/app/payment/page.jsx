'use client';

import { Suspense } from 'react';
import PaymentContent from './PaymentContent';

export default function PaymentPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading payment page...</p>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}