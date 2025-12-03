// components/PaymentButton.jsx - MOCK VERSION
"use client";

import { useState } from 'react';

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment
    setTimeout(() => {
      alert('Payment feature is disabled. Add Razorpay keys to enable real payments.');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now (Demo)'}
    </button>
  );
}