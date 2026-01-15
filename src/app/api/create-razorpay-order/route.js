import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('🔵 Razorpay Order Creation Started');
    
    // Validate environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      console.error('❌ Missing Razorpay credentials');
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
    const Razorpay = (await import('razorpay')).default;
    
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
        phone: '7079948109'
      },
      payment_capture: 1
    };

    console.log(' Creating order with:', {
      amount: `${orderOptions.amount / 100} INR`,
      userType: body.userType,
      planId: body.planId
    });

    const order = await razorpay.orders.create(orderOptions);
    
    console.log(' Order created:', order.id);

    return NextResponse.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
    
  } catch (error) {
    console.error('❌ Razorpay order error:', error);
    
    let errorMessage = 'Failed to create payment order';
    if (error.error?.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        support: 'Call 70799 48109 for immediate help'
      },
      { status: 500 }
    );
  }
}