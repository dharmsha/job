/**
 * Razorpay Payment Utilities
 * Client-side helper functions for Razorpay integration
 */

// Load Razorpay SDK dynamically
export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      console.log('✅ Razorpay SDK already loaded');
      resolve(true);
      return;
    }

    // Check if we're in browser
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay can only be loaded in browser'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.id = 'razorpay-sdk';
    
    script.onload = () => {
      if (window.Razorpay) {
        console.log('✅ Razorpay SDK loaded successfully');
        resolve(true);
      } else {
        reject(new Error('Razorpay SDK not available after loading'));
      }
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Razorpay SDK:', error);
      document.getElementById('razorpay-sdk')?.remove();
      reject(new Error('Failed to load payment gateway. Please check your internet connection.'));
    };
    
    document.body.appendChild(script);
  });
};

// Create order on server
export const createRazorpayOrder = async (amountInRupees, currency = 'INR', notes = {}) => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amountInRupees * 100), // Convert to paise
        currency: currency,
        notes: notes
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Order creation failed:', data);
      throw new Error(data.error || 'Failed to create payment order');
    }

    if (!data.success) {
      throw new Error(data.error || 'Order creation failed');
    }

    console.log('✅ Order created:', data.order.id);
    return data.order;

  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment on server
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Payment verification failed:', data);
      throw new Error(data.error || 'Payment verification failed');
    }

    if (!data.success) {
      throw new Error(data.error || 'Payment verification failed');
    }

    console.log('✅ Payment verified:', data.data.paymentId);
    return data;

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    throw error;
  }
};

// Main payment initiation function
export const initiatePayment = async (paymentOptions) => {
  const {
    orderId,
    amount,
    currency = 'INR',
    description = 'Payment',
    userDetails = {},
    onSuccess = null,
    onDismiss = null,
    onError = null
  } = paymentOptions;

  // Ensure Razorpay is loaded
  await loadRazorpay();

  if (!window.Razorpay) {
    throw new Error('Payment gateway not available');
  }

  return new Promise((resolve, reject) => {
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Job Portal',
        description: description,
        order_id: orderId,
        
        // Pre-fill customer details
        prefill: {
          name: userDetails.name || '',
          email: userDetails.email || '',
          contact: userDetails.contact || userDetails.phone || ''
        },
        
        // Theme customization
        theme: {
          color: '#3B82F6',
          backdrop_color: '#1F2937'
        },
        
        // Modal settings
        modal: {
          escape: true,
          ondismiss: function() {
            const error = new Error('Payment cancelled by user');
            if (onDismiss) onDismiss();
            reject(error);
          },
          animation: true,
        },
        
        // Payment handlers
        handler: async function (response) {
          try {
            // Verify payment on server
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
              ...userDetails
            });

            if (verification.success) {
              const result = {
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                verification: verification.data,
                timestamp: new Date().toISOString()
              };

              if (onSuccess) onSuccess(result);
              resolve(result);
            } else {
              throw new Error('Payment verification failed');
            }
            
          } catch (error) {
            console.error('Payment handler error:', error);
            if (onError) onError(error);
            reject(error);
          }
        },
        
        // Additional options
        notes: {
          source: 'job_portal_web',
          ...userDetails
        },
        
        // Retry options
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      // Create and open Razorpay instance
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      if (onError) onError(error);
      reject(error);
    }
  });
};

// Complete payment flow (all-in-one function)
export const processPayment = async ({
  amount,
  planName = 'Service',
  userDetails = {},
  onSuccess = null,
  onError = null
}) => {
  try {
    console.log('Starting payment process for amount:', amount);

    // Step 1: Create order
    const order = await createRazorpayOrder(amount, 'INR', {
      plan: planName,
      userId: userDetails.id || 'unknown'
    });

    // Step 2: Initiate payment
    const result = await initiatePayment({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description: `Payment for ${planName} - ₹${amount}`,
      userDetails: userDetails,
      onSuccess: onSuccess,
      onError: onError
    });

    return result;

  } catch (error) {
    console.error('Payment process failed:', error);
    
    if (onError) {
      onError(error);
    }
    
    throw error;
  }
};

// Utility function to format amount
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Check if Razorpay is available
export const isRazorpayAvailable = () => {
  return typeof window !== 'undefined' && window.Razorpay;
};

// Get Razorpay SDK status
export const getRazorpayStatus = () => {
  if (typeof window === 'undefined') return 'not_in_browser';
  if (window.Razorpay) return 'loaded';
  
  const script = document.getElementById('razorpay-sdk');
  if (script) return 'loading';
  
  return 'not_loaded';
};