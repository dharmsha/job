import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      userType,
      planId,
      amount
    } = body;

    // Verify signature
    const bodyText = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(bodyText)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return Response.json({
        success: false,
        error: 'Invalid payment signature'
      }, { status: 400 });
    }

    // You can also verify with Razorpay API
    // const razorpay = new Razorpay({
    //   key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET
    // });
    // const payment = await razorpay.payments.fetch(razorpay_payment_id);

    return Response.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      userId,
      userType,
      planId,
      amount
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Payment verification failed'
    }, { status: 500 });
  }
}