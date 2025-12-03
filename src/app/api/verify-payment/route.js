// app/api/verify-payment/route.js - MOCK VERSION
import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({
    success: true,
    message: 'Payment verified (mock mode)',
    data: {
      paymentId: `mock_${Date.now()}`,
      verifiedAt: new Date().toISOString()
    }
  });
}