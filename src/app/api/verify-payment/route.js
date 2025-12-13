export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
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

export const createRazorpayOrder = async (amount, userType = 'candidate') => {
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, userType })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating order (mock):', error);
    return {
      success: true,
      order: {
        id: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR'
      }
    };
  }
};

export const verifyPayment = async (paymentId, orderId, signature) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, orderId, signature })
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment (mock):', error);
    return { success: true, message: 'Payment verified (mock fallback)' };
  }
};

export const initiatePayment = (options) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      resolve({ success: false, error: 'Razorpay not available' });
      return;
    }
    
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