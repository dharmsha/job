import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      planId,
      amount 
    } = body;

    // Validate required fields
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
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment signature' 
        },
        { status: 400 }
      );
    }

    // ✅ Payment verified successfully
    
    // Here you can:
    // 1. Save payment to database
    // 2. Update user subscription
    // 3. Send confirmation email
    // 4. Create order record

    // Example: Save payment to database (you'll need to implement your own DB logic)
    // await savePaymentToDatabase({
    //   paymentId: razorpay_payment_id,
    //   orderId: razorpay_order_id,
    //   amount,
    //   userId,
    //   planId,
    //   status: 'completed',
    //   timestamp: new Date()
    // });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount,
        verifiedAt: new Date().toISOString(),
        signatureVerified: true
      }
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during payment verification',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}