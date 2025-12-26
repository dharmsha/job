import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // Check if we have the required environment variables
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay webhook secret');
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment verification not configured'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Required fields
    const requiredFields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing payment verification data',
          missing: missingFields 
        },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Generate expected signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    console.log('Payment verification:', {
      orderId: razorpay_order_id.substring(0, 10) + '...',
      paymentId: razorpay_payment_id.substring(0, 10) + '...',
      signatureMatch: expectedSignature === razorpay_signature
    });

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: 'valid',
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('Signature mismatch:', {
        expected: expectedSignature.substring(0, 20) + '...',
        received: razorpay_signature.substring(0, 20) + '...'
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment signature',
          details: 'Payment verification failed. Please contact support.'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment verification failed',
        details: 'Please contact support at 70799 48109'
      },
      { status: 500 }
    );
  }
}