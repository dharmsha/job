// app/api/razorpay/check-payment/route.js
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { paymentId, orderId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    console.log('Payment Status:', payment.status);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100, // Convert paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        bank: payment.bank,
        card_id: payment.card_id,
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at,
        order_id: payment.order_id
      }
    });

  } catch (error) {
    console.error('Payment fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch payment details',
        code: error.error?.code 
      },
      { status: 500 }
    );
  }
}