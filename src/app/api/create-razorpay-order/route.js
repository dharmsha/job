import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    const options = {
      amount: body.amount, // Already in paise
      currency: body.currency || 'INR',
      receipt: `receipt_${Date.now()}_${body.userId}`,
      notes: {
        userId: body.userId,
        userType: body.userType,
        planId: body.planId,
        email: body.email
      }
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
    
  } catch (error) {
    console.error('Razorpay order error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create order',
        details: 'Check Razorpay keys and server configuration'
      },
      { status: 500 }
    );
  }
}