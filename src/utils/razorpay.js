// utils/mock-razorpay.js
export const loadRazorpay = () => Promise.resolve(true);
export const createRazorpayOrder = () => Promise.resolve({ 
  id: 'mock_order_123', 
  amount: 50000 
});
export const verifyPayment = () => Promise.resolve({ success: true });
export const initiatePayment = () => Promise.resolve({ 
  success: true, 
  paymentId: 'mock_pay_123' 
});