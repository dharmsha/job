import { NextResponse } from 'next/server';

// DO NOT initialize Razorpay at top level - only in the handler
// This prevents build errors when env vars are missing

export async function POST(request) {
  try {
    // Check if we have the required environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return NextResponse.json(
        { 
          error: 'Payment gateway not configured',
          message: 'Please check server configuration'
        },
        { status: 500 }
      );
    }

    // Dynamically import Razorpay to avoid build errors
    const Razorpay = (await import('razorpay')).default;
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await request.json();
    
    // Validate amount
    if (!body.amount || body.amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1 (100 paise)' },
        { status: 400 }
      );
    }

    // Validate user ID
    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(body.amount), // Ensure integer
      currency: body.currency || 'INR',
      receipt: `receipt_${Date.now()}_${body.userId.substring(0, 8)}`,
      notes: {
        userId: body.userId,
        userType: body.userType || 'candidate',
        planId: body.planId || 'basic',
        email: body.email || '',
        timestamp: new Date().toISOString()
      },
      payment_capture: 1 // Auto-capture payment
    };

    console.log('Creating Razorpay order with options:', {
      ...options,
      amount: `${options.amount / 100} INR`
    });

    const order = await razorpay.orders.create(options);
    
    console.log('Razorpay order created:', order.id);

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
    console.error('Razorpay order creation error:', error);
    
    let errorMessage = 'Failed to create payment order';
    let statusCode = 500;
    
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Handle specific error cases
    if (errorMessage.includes('key_id')) {
      errorMessage = 'Payment gateway configuration error. Please contact support.';
    } else if (errorMessage.includes('amount')) {
      errorMessage = 'Invalid amount specified';
      statusCode = 400;
    } else if (errorMessage.includes('authentication')) {
      errorMessage = 'Payment authentication failed. Check your Razorpay keys.';
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: 'Please try again or contact support at 70799 48109'
      },
      { status: statusCode }
    );
  }
}