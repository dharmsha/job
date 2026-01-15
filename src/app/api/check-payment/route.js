// app/api/check-payment/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    // ✅ IMPORTANT: Use proper variable names
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log('Checking env vars:', { 
      hasKeyId: !!key_id, 
      hasKeySecret: !!key_secret 
    });
    
    if (!key_id || !key_secret) {
      return NextResponse.json(
        { 
          error: 'Razorpay keys not configured',
          key_id_missing: !key_id,
          key_secret_missing: !key_secret
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // Rest of your code...
    
  } catch (error) {
    console.error('Check payment error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}