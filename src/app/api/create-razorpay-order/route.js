// app/api/razorpay/create-order/route.js
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Initialize Razorpay with LIVE keys
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt, notes } = await request.json();

    // Validate amount
    if (!amount || amount < 100) { // Minimum ₹1 (100 paise)
      return NextResponse.json(
        { success: false, error: 'Invalid amount. Minimum ₹1 required.' },
        { status: 400 }
      );
    }

    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // Amount in paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture
      notes: notes || {}
    });

    console.log('✅ Razorpay Order Created:', order.id);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });

  } catch (error) {
    console.error('❌ Razorpay Order Error:', error);
    
    // Return user-friendly error
    let errorMessage = 'Failed to create payment order';
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        code: error.error?.code || 'ORDER_CREATION_FAILED'
      },
      { status: 500 }
    );
  }
}