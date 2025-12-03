import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { amount, currency = 'INR', notes = {} } = body;

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid amount. Amount must be a positive number.' 
        },
        { status: 400 }
      );
    }

    // Convert to paise (₹1 = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes: {
        source: 'job_portal',
        created_at: new Date().toISOString(),
        ...notes
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at
      }
    });

  } catch (error) {
    console.error('❌ Razorpay order creation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payment order',
        code: error.error?.code,
        description: error.error?.description
      },
      { status: 500 }
    );
  }
}