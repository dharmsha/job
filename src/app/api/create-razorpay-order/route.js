import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('🔵 Razorpay Order Creation Started');
    
    // Sirf NEXT_PUBLIC wali key use karo (same as frontend)
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log('Mode:', keyId?.includes('live') ? 'LIVE' : 'TEST');
    console.log('Key ID (first 10 chars):', keyId?.substring(0, 10));
    console.log('Key Secret exists:', !!keySecret);
    
    if (!keyId || !keySecret) {
      console.error(' Missing Razorpay credentials');
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment gateway not configured',
          message: 'Contact support: 70799 48109'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body:', {
      amount: body.amount,
      userId: body.userId?.substring(0, 10),
      userType: body.userType,
      planId: body.planId
    });
    
    // Validate required fields
    if (!body.amount || body.amount < 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Amount must be at least ₹1 (100 paise)' 
        },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User ID is required' 
        },
        { status: 400 }
      );
    }

    // Dynamically import Razorpay
    let Razorpay;
    try {
      const razorpayModule = await import('razorpay');
      Razorpay = razorpayModule.default;
      console.log('✅ Razorpay module loaded');
    } catch (importError) {
      console.error('❌ Razorpay import failed:', importError.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment library not installed. Run: npm install razorpay',
          support: 'Call 70799 48109'
        },
        { status: 500 }
      );
    }
    
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const orderOptions = {
      amount: Math.round(body.amount),
      currency: body.currency || 'INR',
      receipt: `receipt_${Date.now()}_${body.userId.substring(0, 8)}`,
      notes: {
        userId: body.userId,
        userType: body.userType || 'candidate',
        planId: body.planId || 'basic',
        email: body.email || '',
        timestamp: new Date().toISOString(),
        phone: '7070853444'
      },
      payment_capture: 1
    };

    console.log('📝 Creating order:', {
      amount: `₹${orderOptions.amount / 100}`,
      currency: orderOptions.currency,
      userType: body.userType
    });

    const order = await razorpay.orders.create(orderOptions);
    
    console.log('✅ Order created successfully:', order.id);

    return NextResponse.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at
    });
    
  } catch (error) {
    console.error('❌ Razorpay Error Details:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
    
    let errorMessage = 'Failed to create payment order';
    let statusCode = 500;
    
    // Handle different error types
    if (error.error?.description) {
      errorMessage = error.error.description;
      statusCode = error.statusCode || 400;
      
      // Specific error messages
      if (errorMessage.includes('KYC')) {
        errorMessage = 'KYC verification pending. Please contact Razorpay support to complete verification.';
      } else if (errorMessage.includes('key')) {
        errorMessage = 'Invalid API keys. Please check your Razorpay credentials.';
      } else if (errorMessage.includes('live')) {
        errorMessage = 'Live mode requires KYC verification. Contact support: 70799 48109';
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
        errorMessage = 'Authentication failed. Please check your Razorpay keys. Contact support: 70799 48109';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        support: 'Call 70799 48109 for immediate help'
      },
      { status: statusCode }
    );
  }
}