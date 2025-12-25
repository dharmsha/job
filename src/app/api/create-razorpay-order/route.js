// app/api/create-razorpay-order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    // ✅ Correct way - check both keys
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_id || !key_secret) {
      console.error('Missing Razorpay keys:', { 
        key_id: !!key_id, 
        key_secret: !!key_secret 
      });
      return NextResponse.json(
        { error: 'Razorpay configuration missing' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // Rest of your code...
    
  } catch (error) {
    console.error('Razorpay error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}