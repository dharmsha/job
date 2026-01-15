import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Required fields
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing payment verification data' 
        },
        { status: 400 }
      );
    }

    // Generate expected signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    console.log('🔍 Payment verification:', {
      orderId: razorpay_order_id.substring(0, 10) + '...',
      signatureMatch: expectedSignature === razorpay_signature
    });

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        verifiedAt: new Date().toISOString()
      });
    } else {
      console.error('❌ Signature mismatch');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment signature',
          support: 'Call 70799 48109'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment verification failed',
        support: 'Call 70799 48109'
      },
      { status: 500 }
    );
  }
}