import Razorpay from 'razorpay';

let razorpayInstance = null;

// Load Razorpay script dynamically
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order via API
export const createRazorpayOrder = async (amount, userType = 'candidate') => {
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        userType: userType
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (paymentId, orderId, signature) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        orderId,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Initiate payment
export const initiatePayment = async (options) => {
  return new Promise((resolve) => {
    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on('payment.success', (response) => {
      resolve({ success: true, response });
    });
    rzp.on('payment.error', (error) => {
      resolve({ success: false, error });
    });
  });
};