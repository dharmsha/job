"use client";

import { useState } from 'react';
import { loadRazorpay, createRazorpayOrder, initiatePayment } from '@/utils/razorpay';

export default function PaymentButton({ 
  amount = 500,
  planName = "Basic Plan",
  planId = "basic",
  userDetails = {},
  onSuccess = null,
  onError = null,
  className = ""
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setStatus(null);

    try {
      // Step 1: Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Step 2: Create order on server
      setStatus({ type: 'info', message: 'Creating order...' });
      const order = await createRazorpayOrder(amount);

      // Step 3: Initiate payment
      setStatus({ type: 'info', message: 'Opening payment gateway...' });
      
      const paymentResult = await initiatePayment({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        description: `Payment for ${planName}`,
        userDetails: {
          name: userDetails.name || 'Customer',
          email: userDetails.email || '',
          contact: userDetails.phone || ''
        }
      });

      if (paymentResult.success) {
        setStatus({ 
          type: 'success', 
          message: 'Payment successful! Redirecting...' 
        });
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(paymentResult);
        }
        
        // Optional: Redirect to success page
        setTimeout(() => {
          window.location.href = `/payment-success?payment_id=${paymentResult.paymentId}`;
        }, 2000);
        
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      
      setStatus({ 
        type: 'error', 
        message: error.message || 'Payment failed. Please try again.' 
      });
      
      // Call error callback if provided
      if (onError) {
        onError(error);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`payment-button-wrapper ${className}`}>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`
          w-full px-6 py-3 rounded-lg font-medium
          transition-all duration-300
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }
          text-white shadow-md hover:shadow-lg
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay ₹{amount}
          </span>
        )}
      </button>

      {status && (
        <div className={`
          mt-4 p-3 rounded-lg border text-sm
          ${status.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : status.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
          }
        `}>
          <div className="flex items-center gap-2">
            {status.type === 'success' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {status.type === 'error' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {status.type === 'info' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            <span>{status.message}</span>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Secure payment powered by Razorpay</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span>🔒 128-bit SSL</span>
          <span>✅ PCI DSS Compliant</span>
        </div>
      </div>
    </div>
  );
}

// Optional: Prop validation for TypeScript/development
PaymentButton.defaultProps = {
  amount: 500,
  planName: "Basic Plan",
  planId: "basic",
  userDetails: {},
  className: ""
};