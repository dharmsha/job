import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(request) {
  try {
    const { amount, currency = 'INR', userType, planId, userId } = await request.json();

    if (!amount || !userType || !userId) {
      return Response.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // Already in paise
      currency: currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        userType: userType,
        planId: planId
      }
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Failed to create order'
    }, { status: 500 });
  }
}