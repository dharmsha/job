import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, currency = 'INR', userType } = await request.json();

    let finalAmount = amount;
    if (!amount) {
      finalAmount = userType === 'institute' ? 20000 : 5000; // in paise
    }

    // Mock order
    const order = {
      id: `mock_order_${Date.now()}`,
      amount: finalAmount,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created'
    };

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      note: 'Mock order - for testing only'
    });

  } catch (error) {
    console.error('Error creating mock order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create mock order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}